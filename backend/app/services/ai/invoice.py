from __future__ import annotations

from fastapi import UploadFile

from app.services.ai.provider import provider


async def extract_invoice_items(*, tenant_id: str, upload: UploadFile) -> list[dict]:
    _ = tenant_id
    content = await upload.read()
    system = (
        "Extract invoice line items into JSON array with keys: product_name, sku, quantity, unit_price, supplier. "
        "If unknown, set null. Output JSON only."
    )
    user = f"Filename: {upload.filename}\nBytes: {len(content)}"
    resp = await provider.chat(system=system, user=user)
    # Fallback: no extraction without LLM
    return [{"raw": resp.get("output_text", ""), "product_name": None, "sku": None, "quantity": None, "unit_price": None, "supplier": None}]

