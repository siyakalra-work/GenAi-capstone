from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_tenant_id, require_role
from app.core.errors import http_400, http_404
from app.db.session import get_db
from app.models.product import Product
from app.models.user import User
from app.repositories.product_repo import ProductRepo
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate
from app.services.audit import write_audit
from app.services.rbac import Role

router = APIRouter()


def _ensure_tenant(user: User) -> str:
    tenant_id = get_tenant_id(user)
    if not tenant_id:
        raise http_400("Tenant context required")
    return tenant_id


@router.get("", response_model=dict)
async def list_products(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    q: str | None = None,
    category: str | None = None,
    brand: str | None = None,
    stock_status: str | None = Query(default=None, pattern="^(low|out)?$"),
    price_min: float | None = None,
    price_max: float | None = None,
):
    tenant_id = _ensure_tenant(user)
    repo = ProductRepo(db, tenant_id)
    items, total = await repo.list(
        page=page,
        page_size=page_size,
        q=q,
        category=category,
        brand=brand,
        stock_status=stock_status,
        price_min=price_min,
        price_max=price_max,
    )
    return {"meta": {"page": page, "page_size": page_size, "total": total}, "items": [ProductOut.model_validate(i).model_dump() for i in items]}


@router.post("", response_model=ProductOut, dependencies=[Depends(require_role(Role.INVENTORY_MANAGER))])
async def create_product(payload: ProductCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> ProductOut:
    tenant_id = _ensure_tenant(user)
    row = Product(
        id=str(uuid4()),
        tenant_id=tenant_id,
        **payload.model_dump(),
    )
    row = await ProductRepo(db, tenant_id).create(row)
    await write_audit(db, tenant_id=tenant_id, actor_user_id=user.id, action="product.create", entity="product", entity_id=row.id)
    return ProductOut.model_validate(row)


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> ProductOut:
    tenant_id = _ensure_tenant(user)
    row = await ProductRepo(db, tenant_id).get(product_id)
    if not row:
        raise http_404("Product not found")
    return ProductOut.model_validate(row)


@router.put("/{product_id}", response_model=ProductOut, dependencies=[Depends(require_role(Role.INVENTORY_MANAGER))])
async def update_product(
    product_id: str, payload: ProductUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
) -> ProductOut:
    tenant_id = _ensure_tenant(user)
    repo = ProductRepo(db, tenant_id)
    row = await repo.get(product_id)
    if not row:
        raise http_404("Product not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(row, k, v)
    row = await repo.update(row)
    await write_audit(db, tenant_id=tenant_id, actor_user_id=user.id, action="product.update", entity="product", entity_id=row.id)
    return ProductOut.model_validate(row)


@router.delete("/{product_id}", dependencies=[Depends(require_role(Role.RETAILER_ADMIN))])
async def delete_product(product_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    tenant_id = _ensure_tenant(user)
    repo = ProductRepo(db, tenant_id)
    row = await repo.get(product_id)
    if not row:
        raise http_404("Product not found")
    await repo.delete(row)
    await write_audit(db, tenant_id=tenant_id, actor_user_id=user.id, action="product.delete", entity="product", entity_id=product_id)
    return {"ok": True}

