from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.inventory_transaction import InventoryTransaction
from app.models.product import Product


async def low_stock_products(db: AsyncSession, *, tenant_id: str, threshold: int = 10) -> list[dict]:
    res = await db.execute(
        select(Product).where(Product.tenant_id == tenant_id, Product.quantity < threshold).order_by(Product.quantity.asc())
    )
    return [
        {"id": p.id, "sku": p.sku, "product_name": p.product_name, "quantity": p.quantity}
        for p in res.scalars().all()
    ]


async def inventory_summary(db: AsyncSession, *, tenant_id: str) -> dict:
    res = await db.execute(select(Product).where(Product.tenant_id == tenant_id))
    products = list(res.scalars().all())
    low = [p for p in products if p.quantity < 10]
    return {"total_products": len(products), "low_stock": len(low)}


async def recent_transactions(db: AsyncSession, *, tenant_id: str, limit: int = 10) -> list[dict]:
    res = await db.execute(
        select(InventoryTransaction)
        .where(InventoryTransaction.tenant_id == tenant_id)
        .order_by(InventoryTransaction.created_at.desc())
        .limit(limit)
    )
    return [
        {
            "id": t.id,
            "product_id": t.product_id,
            "transaction_type": t.transaction_type,
            "quantity": t.quantity,
            "created_at": str(t.created_at),
        }
        for t in res.scalars().all()
    ]

