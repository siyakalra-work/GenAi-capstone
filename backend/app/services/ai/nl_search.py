from __future__ import annotations

import re

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.product_repo import ProductRepo


def _parse_simple(query: str) -> dict:
    q = query.lower()
    out: dict = {"q": None, "category": None, "brand": None, "stock_status": None, "price_min": None, "price_max": None}
    m = re.search(r"below\\s+(\\d+)\\s+units", q)
    if m:
        out["stock_status"] = "low"
    m = re.search(r"under\\s+[₹$]?\\s*(\\d+(?:\\.\\d+)?)", q)
    if m:
        out["price_max"] = float(m.group(1))
    return out


async def nl_to_filters_and_products(*, db: AsyncSession, tenant_id: str, query: str) -> tuple[dict, list[dict]]:
    filters = _parse_simple(query)
    repo = ProductRepo(db, tenant_id)
    items, _total = await repo.list(page=1, page_size=50, **filters)
    products = [
        {"id": p.id, "sku": p.sku, "product_name": p.product_name, "quantity": p.quantity, "price": float(p.price) if p.price is not None else None}
        for p in items
    ]
    return filters, products

