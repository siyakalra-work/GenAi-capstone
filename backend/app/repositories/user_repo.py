from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, *, email: str, tenant_id: str | None) -> User | None:
        stmt = select(User).where(User.email == email)
        if tenant_id is None:
            stmt = stmt.where(User.tenant_id.is_(None))
        else:
            stmt = stmt.where(User.tenant_id == tenant_id)
        res = await self.db.execute(stmt)
        return res.scalar_one_or_none()

    async def create(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

