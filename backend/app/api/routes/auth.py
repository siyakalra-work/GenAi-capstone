from __future__ import annotations

from datetime import timedelta
from uuid import uuid4

from fastapi import APIRouter, Depends, Request
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.errors import http_400, http_401
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models.tenant import Tenant
from app.models.user import User
from app.repositories.user_repo import UserRepo
from app.schemas.auth import ChangePasswordIn, LoginIn, ProfileOut, RegisterIn, TokenOut
from app.services.audit import write_audit
from app.services.rbac import Role
from app.services.rate_limit import rate_limiter

router = APIRouter()


@router.post("/register", response_model=TokenOut)
async def register(payload: RegisterIn, request: Request, db: AsyncSession = Depends(get_db)) -> TokenOut:
    await rate_limiter.check(request, key_suffix="register")
    repo = UserRepo(db)

    # If company_name provided => create tenant + retailer_admin user.
    tenant_id: str | None = None
    role = payload.role or Role.RETAILER_ADMIN
    if payload.company_name:
        tenant = Tenant(
            id=str(uuid4()),
            company_name=payload.company_name,
            contact_email=payload.email,
            status="active",
        )
        db.add(tenant)
        await db.commit()
        tenant_id = tenant.id
        role = Role.RETAILER_ADMIN
    else:
        # super admin registration (no tenant)
        role = payload.role or Role.SUPER_ADMIN

    existing = await repo.get_by_email(email=str(payload.email), tenant_id=tenant_id)
    if existing:
        raise http_400("User already exists")

    user = User(
        id=str(uuid4()),
        tenant_id=tenant_id,
        name=payload.name,
        email=str(payload.email).lower(),
        password_hash=hash_password(payload.password),
        role=str(role),
        is_active=True,
    )
    await repo.create(user)
    await write_audit(db, tenant_id=tenant_id, actor_user_id=user.id, action="auth.register", entity="user", entity_id=user.id)

    return TokenOut(
        access_token=create_access_token(user_id=user.id, tenant_id=tenant_id, role=user.role),
        refresh_token=create_refresh_token(user_id=user.id, tenant_id=tenant_id, role=user.role),
    )


@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, request: Request, db: AsyncSession = Depends(get_db)) -> TokenOut:
    await rate_limiter.check(request, key_suffix="login")
    repo = UserRepo(db)
    user = await repo.get_by_email(email=str(payload.email).lower(), tenant_id=payload.tenant_id)
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise http_401("Invalid credentials")
    await write_audit(db, tenant_id=user.tenant_id, actor_user_id=user.id, action="auth.login", entity="user", entity_id=user.id)
    return TokenOut(
        access_token=create_access_token(user_id=user.id, tenant_id=user.tenant_id, role=user.role),
        refresh_token=create_refresh_token(user_id=user.id, tenant_id=user.tenant_id, role=user.role),
    )


@router.post("/refresh", response_model=TokenOut)
async def refresh(request: Request, refresh_token: str, db: AsyncSession = Depends(get_db)) -> TokenOut:
    await rate_limiter.check(request, key_suffix="refresh")
    try:
        payload = jwt.decode(refresh_token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError as e:
        raise http_401("Invalid refresh token") from e
    if payload.get("type") != "refresh":
        raise http_401("Invalid token type")
    user_id = payload.get("sub")
    user = await db.get(User, user_id)
    if not user or not user.is_active:
        raise http_401("Inactive user")
    return TokenOut(
        access_token=create_access_token(user_id=user.id, tenant_id=user.tenant_id, role=user.role),
        refresh_token=create_refresh_token(user_id=user.id, tenant_id=user.tenant_id, role=user.role),
    )


@router.get("/profile", response_model=ProfileOut)
async def profile(user: User = Depends(get_current_user)) -> ProfileOut:
    return ProfileOut(id=user.id, tenant_id=user.tenant_id, name=user.name, email=user.email, role=user.role)


@router.post("/change-password")
async def change_password(
    payload: ChangePasswordIn, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    if not verify_password(payload.current_password, user.password_hash):
        raise http_400("Current password is incorrect")
    user.password_hash = hash_password(payload.new_password)
    db.add(user)
    await db.commit()
    await write_audit(db, tenant_id=user.tenant_id, actor_user_id=user.id, action="auth.change_password")
    return {"ok": True}

