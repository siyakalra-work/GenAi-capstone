from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.inventory_transaction import InventoryTransaction


class InventoryRepo:
    def __init__(self, db: AsyncSession, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id

    async def list(self, *, page: int, page_size: int) -> list[InventoryTransaction]:
        stmt = (
            select(InventoryTransaction)
            .where(InventoryTransaction.tenant_id == self.tenant_id)
            .order_by(InventoryTransaction.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def create(self, tx: InventoryTransaction) -> InventoryTransaction:
        self.db.add(tx)
        await self.db.commit()
        await self.db.refresh(tx)
        return tx

