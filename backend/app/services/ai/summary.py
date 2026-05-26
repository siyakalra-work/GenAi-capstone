from __future__ import annotations

import json

from sqlalchemy.ext.asyncio import AsyncSession

from app.services.ai.provider import provider
from app.services.ai.sql_tools import inventory_summary, low_stock_products


async def generate_inventory_summary(*, db: AsyncSession, tenant_id: str) -> str:
    summary = await inventory_summary(db, tenant_id=tenant_id)
    low = await low_stock_products(db, tenant_id=tenant_id)
    system = "Write a concise executive inventory summary. Use the provided JSON data only."
    user = json.dumps({"summary": summary, "low_stock": low[:20]}, indent=2)
    resp = await provider.chat(system=system, user=user)
    return resp.get("output_text", "")

