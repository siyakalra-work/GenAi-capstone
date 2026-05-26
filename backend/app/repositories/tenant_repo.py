from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tenant import Tenant


class TenantRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list(self) -> list[Tenant]:
        res = await self.db.execute(select(Tenant).order_by(Tenant.created_at.desc()))
        return list(res.scalars().all())

    async def get(self, tenant_id: str) -> Tenant | None:
        return await self.db.get(Tenant, tenant_id)

    async def create(self, tenant: Tenant) -> Tenant:
        self.db.add(tenant)
        await self.db.commit()
        await self.db.refresh(tenant)
        return tenant

    async def delete(self, tenant: Tenant) -> None:
        await self.db.delete(tenant)
        await self.db.commit()

