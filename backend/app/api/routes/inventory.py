from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_tenant_id, require_role
from app.core.errors import http_400, http_404
from app.db.session import get_db
from app.models.inventory_transaction import InventoryTransaction
from app.models.user import User
from app.repositories.inventory_repo import InventoryRepo
from app.repositories.product_repo import ProductRepo
from app.schemas.inventory import AdjustmentIn, InventoryTransactionOut, StockChangeIn
from app.services.audit import write_audit
from app.services.rbac import Role

router = APIRouter()


def _ensure_tenant(user: User) -> str:
    tenant_id = get_tenant_id(user)
    if not tenant_id:
        raise http_400("Tenant context required")
    return tenant_id


@router.get("/transactions", response_model=list[InventoryTransactionOut])
async def list_transactions(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=200),
):
    tenant_id = _ensure_tenant(user)
    rows = await InventoryRepo(db, tenant_id).list(page=page, page_size=page_size)
    return [InventoryTransactionOut.model_validate(r) for r in rows]


@router.post("/stock-in", response_model=InventoryTransactionOut, dependencies=[Depends(require_role(Role.INVENTORY_MANAGER))])
async def stock_in(payload: StockChangeIn, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    tenant_id = _ensure_tenant(user)
    product_repo = ProductRepo(db, tenant_id)
    product = await product_repo.get(payload.product_id)
    if not product:
        raise http_404("Product not found")
    product.quantity += payload.quantity
    await product_repo.update(product)
    tx = InventoryTransaction(
        id=str(uuid4()),
        tenant_id=tenant_id,
        product_id=product.id,
        transaction_type="in",
        quantity=payload.quantity,
        updated_by=user.id,
        notes=payload.notes,
    )
    tx = await InventoryRepo(db, tenant_id).create(tx)
    await write_audit(db, tenant_id=tenant_id, actor_user_id=user.id, action="inventory.stock_in", entity="product", entity_id=product.id)
    return InventoryTransactionOut.model_validate(tx)


@router.post("/stock-out", response_model=InventoryTransactionOut, dependencies=[Depends(require_role(Role.INVENTORY_MANAGER))])
async def stock_out(payload: StockChangeIn, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    tenant_id = _ensure_tenant(user)
    product_repo = ProductRepo(db, tenant_id)
    product = await product_repo.get(payload.product_id)
    if not product:
        raise http_404("Product not found")
    if product.quantity < payload.quantity:
        raise http_400("Insufficient stock")
    product.quantity -= payload.quantity
    await product_repo.update(product)
    tx = InventoryTransaction(
        id=str(uuid4()),
        tenant_id=tenant_id,
        product_id=product.id,
        transaction_type="out",
        quantity=payload.quantity,
        updated_by=user.id,
        notes=payload.notes,
    )
    tx = await InventoryRepo(db, tenant_id).create(tx)
    await write_audit(db, tenant_id=tenant_id, actor_user_id=user.id, action="inventory.stock_out", entity="product", entity_id=product.id)
    return InventoryTransactionOut.model_validate(tx)


@router.post("/adjustment", response_model=InventoryTransactionOut, dependencies=[Depends(require_role(Role.INVENTORY_MANAGER))])
async def adjustment(payload: AdjustmentIn, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    tenant_id = _ensure_tenant(user)
    product_repo = ProductRepo(db, tenant_id)
    product = await product_repo.get(payload.product_id)
    if not product:
        raise http_404("Product not found")
    diff = payload.new_quantity - product.quantity
    product.quantity = payload.new_quantity
    await product_repo.update(product)
    tx = InventoryTransaction(
        id=str(uuid4()),
        tenant_id=tenant_id,
        product_id=product.id,
        transaction_type="adjustment",
        quantity=diff,
        updated_by=user.id,
        notes=payload.notes,
    )
    tx = await InventoryRepo(db, tenant_id).create(tx)
    await write_audit(db, tenant_id=tenant_id, actor_user_id=user.id, action="inventory.adjustment", entity="product", entity_id=product.id)
    return InventoryTransactionOut.model_validate(tx)

