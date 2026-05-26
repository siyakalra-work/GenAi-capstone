from __future__ import annotations

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product


class ProductRepo:
    def __init__(self, db: AsyncSession, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id

    def _base(self):
        return select(Product).where(Product.tenant_id == self.tenant_id)

    async def get(self, product_id: str) -> Product | None:
        res = await self.db.execute(self._base().where(Product.id == product_id))
        return res.scalar_one_or_none()

    async def list(
        self,
        *,
        page: int,
        page_size: int,
        q: str | None,
        category: str | None,
        brand: str | None,
        stock_status: str | None,
        price_min: float | None,
        price_max: float | None,
    ) -> tuple[list[Product], int]:
        stmt = self._base()
        filters = []
        if q:
            like = f"%{q.lower()}%"
            filters.append(func.lower(Product.product_name).like(like) | func.lower(Product.sku).like(like))
        if category:
            filters.append(Product.category == category)
        if brand:
            filters.append(Product.brand == brand)
        if stock_status == "low":
            filters.append(Product.quantity < 10)
        if stock_status == "out":
            filters.append(Product.quantity == 0)
        if price_min is not None:
            filters.append(Product.price >= price_min)
        if price_max is not None:
            filters.append(Product.price <= price_max)
        if filters:
            stmt = stmt.where(and_(*filters))

        total_stmt = select(func.count()).select_from(stmt.subquery())
        total_res = await self.db.execute(total_stmt)
        total = int(total_res.scalar_one())

        stmt = stmt.order_by(Product.updated_at.desc()).offset((page - 1) * page_size).limit(page_size)
        res = await self.db.execute(stmt)
        return list(res.scalars().all()), total

    async def create(self, product: Product) -> Product:
        self.db.add(product)
        await self.db.commit()
        await self.db.refresh(product)
        return product

    async def update(self, product: Product) -> Product:
        self.db.add(product)
        await self.db.commit()
        await self.db.refresh(product)
        return product

    async def delete(self, product: Product) -> None:
        await self.db.delete(product)
        await self.db.commit()

