from __future__ import annotations

import json

from sqlalchemy.ext.asyncio import AsyncSession

from app.services.ai.provider import provider
from app.services.ai.sql_tools import inventory_summary, low_stock_products, recent_transactions


async def chat_with_inventory(*, db: AsyncSession, tenant_id: str, user_id: str, message: str) -> str:
    _ = user_id
    tools = [
        {"name": "low_stock_products", "description": "List low stock products", "parameters": {"threshold": "int"}},
        {"name": "inventory_summary", "description": "Get inventory summary", "parameters": {}},
        {"name": "recent_transactions", "description": "Get recent inventory transactions", "parameters": {"limit": "int"}},
    ]
    system = (
        "You are Inventory AI Assistant. Always be tenant-safe. "
        "If you need data, call one of the provided tools instead of guessing."
    )

    # Minimal deterministic routing (safe-by-default). Replace with tool-calling LLM in production.
    msg = message.lower()
    if "low" in msg and "stock" in msg:
        data = await low_stock_products(db, tenant_id=tenant_id)
        return json.dumps({"low_stock_products": data}, indent=2)
    if "summary" in msg:
        data = await inventory_summary(db, tenant_id=tenant_id)
        return json.dumps({"inventory_summary": data}, indent=2)
    if "updated today" in msg or "recent" in msg or "transactions" in msg:
        data = await recent_transactions(db, tenant_id=tenant_id)
        return json.dumps({"recent_transactions": data}, indent=2)

    resp = await provider.chat(system=system, user=message, tools=tools)
    return resp.get("output_text", "")

