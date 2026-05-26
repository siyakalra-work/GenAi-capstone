from __future__ import annotations

import os
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.document_chunk import DocumentChunk
from app.models.uploaded_document import UploadedDocument
from app.services.ai.provider import provider
from app.services.rag.qdrant_client import collection_name, qdrant


def _validate_upload(upload: UploadFile) -> None:
    if not upload.filename:
        raise ValueError("Missing filename")
    ext = os.path.splitext(upload.filename.lower())[1]
    if ext not in [".pdf", ".docx", ".txt"]:
        raise ValueError("Unsupported file type")


async def ingest_document(*, db: AsyncSession, tenant_id: str, user_id: str, upload: UploadFile) -> UploadedDocument:
    _validate_upload(upload)
    os.makedirs(settings.upload_dir, exist_ok=True)
    doc_id = str(uuid4())
    safe_name = f"{tenant_id}_{doc_id}_{upload.filename}"
    path = os.path.join(settings.upload_dir, safe_name)
    content = await upload.read()
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise ValueError("File too large")
    with open(path, "wb") as f:
        f.write(content)

    doc = UploadedDocument(id=doc_id, tenant_id=tenant_id, file_name=upload.filename, file_path=path, uploaded_by=user_id)
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    # naive chunking for txt; pdf/docx parsing omitted (can be added with unstructured/pypdf/docx2txt)
    text = content.decode("utf-8", errors="ignore")
    chunks = [text[i : i + 800] for i in range(0, len(text), 800) if text[i : i + 800].strip()]
    points = []
    for idx, chunk in enumerate(chunks):
        emb_id = str(uuid4())
        db.add(DocumentChunk(id=str(uuid4()), tenant_id=tenant_id, document_id=doc.id, content=chunk, embedding_id=emb_id))
        points.append({"id": emb_id, "payload": {"tenant_id": tenant_id, "document_id": doc.id, "chunk_index": idx, "content": chunk}})
    await db.commit()
    await qdrant.upsert(collection=collection_name(tenant_id), points=points)
    return doc


async def ask_document_question(*, db: AsyncSession, tenant_id: str, question: str) -> tuple[str, list[dict]]:
    # Fallback retrieval from DB if qdrant is stubbed; always tenant-filter.
    res = await db.execute(
        select(DocumentChunk).where(DocumentChunk.tenant_id == tenant_id).order_by(DocumentChunk.document_id).limit(5)
    )
    retrieved = list(res.scalars().all())
    citations = [{"document_id": c.document_id, "chunk_id": c.id, "content": c.content[:200]} for c in retrieved]
    context = "\n\n".join([c.content for c in retrieved])
    system = "Answer using the provided context. Cite chunk_ids you used."
    user = f"Question: {question}\n\nContext:\n{context}"
    resp = await provider.chat(system=system, user=user)
    return resp.get("output_text", ""), citations

