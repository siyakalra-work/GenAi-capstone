from __future__ import annotations

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.errors import http_401, http_403
from app.db.session import get_db
from app.models.user import User
from app.services.rbac import Role, role_allows

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError as e:
        raise http_401("Invalid token") from e
    if payload.get("type") != "access":
        raise http_401("Invalid token type")
    user_id = payload.get("sub")
    if not user_id:
        raise http_401("Invalid token subject")
    user = await db.get(User, user_id)
    if not user or not user.is_active:
        raise http_401("Inactive user")
    user.__dict__["_jwt_claims"] = payload
    return user


def require_role(required: Role):
    async def _dep(user: User = Depends(get_current_user)) -> User:
        claims = getattr(user, "_jwt_claims", {})
        role = claims.get("role") or user.role
        if not role_allows(role, required):
            raise http_403()
        return user

    return _dep


def get_tenant_id(user: User) -> str | None:
    claims = getattr(user, "_jwt_claims", {})
    return claims.get("tenant_id") or user.tenant_id

