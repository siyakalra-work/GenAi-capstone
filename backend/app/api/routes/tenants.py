from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_role
from app.core.errors import http_404
from app.db.session import get_db
from app.models.tenant import Tenant
from app.repositories.tenant_repo import TenantRepo
from app.schemas.tenant import TenantCreate, TenantOut, TenantUpdate
from app.services.audit import write_audit
from app.services.rbac import Role

router = APIRouter()


@router.get("", response_model=list[TenantOut], dependencies=[Depends(require_role(Role.SUPER_ADMIN))])
async def list_tenants(db: AsyncSession = Depends(get_db)) -> list[TenantOut]:
    rows = await TenantRepo(db).list()
    return [TenantOut(id=t.id, company_name=t.company_name, contact_email=t.contact_email, status=t.status) for t in rows]


@router.post("", response_model=TenantOut, dependencies=[Depends(require_role(Role.SUPER_ADMIN))])
async def create_tenant(payload: TenantCreate, db: AsyncSession = Depends(get_db)) -> TenantOut:
    row = Tenant(id=str(uuid4()), company_name=payload.company_name, contact_email=str(payload.contact_email), status=payload.status)
    row = await TenantRepo(db).create(row)
    await write_audit(db, tenant_id=None, actor_user_id=None, action="tenant.create", entity="tenant", entity_id=row.id)
    return TenantOut(id=row.id, company_name=row.company_name, contact_email=row.contact_email, status=row.status)


@router.put("/{tenant_id}", response_model=TenantOut, dependencies=[Depends(require_role(Role.SUPER_ADMIN))])
async def update_tenant(tenant_id: str, payload: TenantUpdate, db: AsyncSession = Depends(get_db)) -> TenantOut:
    repo = TenantRepo(db)
    row = await repo.get(tenant_id)
    if not row:
        raise http_404("Tenant not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(row, k, v)
    db.add(row)
    await db.commit()
    await db.refresh(row)
    await write_audit(db, tenant_id=None, actor_user_id=None, action="tenant.update", entity="tenant", entity_id=row.id)
    return TenantOut(id=row.id, company_name=row.company_name, contact_email=row.contact_email, status=row.status)


@router.delete("/{tenant_id}", dependencies=[Depends(require_role(Role.SUPER_ADMIN))])
async def delete_tenant(tenant_id: str, db: AsyncSession = Depends(get_db)):
    repo = TenantRepo(db)
    row = await repo.get(tenant_id)
    if not row:
        raise http_404("Tenant not found")
    await repo.delete(row)
    await write_audit(db, tenant_id=None, actor_user_id=None, action="tenant.delete", entity="tenant", entity_id=tenant_id)
    return {"ok": True}

