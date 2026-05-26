from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_tenant_id
from app.core.errors import http_400
from app.db.session import get_db
from app.models.user import User
from app.schemas.ai import (
    AskDocumentIn,
    AskDocumentOut,
    ChatIn,
    ChatOut,
    InvoiceExtractOut,
    NLSearchIn,
    NLSearchOut,
    SummaryOut,
)
from app.services.ai.assistant import chat_with_inventory
from app.services.ai.invoice import extract_invoice_items
from app.services.ai.nl_search import nl_to_filters_and_products
from app.services.ai.summary import generate_inventory_summary
from app.services.rag.pipeline import ask_document_question, ingest_document

router = APIRouter()


def _ensure_tenant(user: User) -> str:
    tenant_id = get_tenant_id(user)
    if not tenant_id:
        raise http_400("Tenant context required")
    return tenant_id


@router.post("/chat", response_model=ChatOut)
async def chat(payload: ChatIn, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> ChatOut:
    tenant_id = _ensure_tenant(user)
    answer = await chat_with_inventory(db=db, tenant_id=tenant_id, user_id=user.id, message=payload.message)
    return ChatOut(answer=answer)


@router.post("/search", response_model=NLSearchOut)
async def ai_search(payload: NLSearchIn, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> NLSearchOut:
    tenant_id = _ensure_tenant(user)
    filters, products = await nl_to_filters_and_products(db=db, tenant_id=tenant_id, query=payload.query)
    return NLSearchOut(filters=filters, products=products)


@router.post("/summary", response_model=SummaryOut)
async def ai_summary(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> SummaryOut:
    tenant_id = _ensure_tenant(user)
    summary = await generate_inventory_summary(db=db, tenant_id=tenant_id)
    return SummaryOut(summary=summary)


@router.post("/upload-document")
async def upload_document(
    file: UploadFile = File(...), db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
):
    tenant_id = _ensure_tenant(user)
    doc = await ingest_document(db=db, tenant_id=tenant_id, user_id=user.id, upload=file)
    return {"document_id": doc.id}


@router.post("/ask-document", response_model=AskDocumentOut)
async def ask_document(
    payload: AskDocumentIn, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
) -> AskDocumentOut:
    tenant_id = _ensure_tenant(user)
    answer, citations = await ask_document_question(db=db, tenant_id=tenant_id, question=payload.question)
    return AskDocumentOut(answer=answer, citations=citations)


@router.post("/extract-invoice", response_model=InvoiceExtractOut)
async def extract_invoice(
    file: UploadFile = File(...), user: User = Depends(get_current_user)
) -> InvoiceExtractOut:
    tenant_id = _ensure_tenant(user)
    items = await extract_invoice_items(tenant_id=tenant_id, upload=file)
    return InvoiceExtractOut(items=items)

