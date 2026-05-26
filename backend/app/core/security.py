from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_token(*, subject: str, claims: dict[str, Any], expires_delta: timedelta) -> str:
    now = datetime.now(UTC)
    payload = {"sub": subject, "iat": int(now.timestamp()), "exp": int((now + expires_delta).timestamp())}
    payload.update(claims)
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_access_token(*, user_id: str, tenant_id: str | None, role: str) -> str:
    return create_token(
        subject=user_id,
        claims={"tenant_id": tenant_id, "role": role, "type": "access"},
        expires_delta=timedelta(minutes=settings.access_token_minutes),
    )


def create_refresh_token(*, user_id: str, tenant_id: str | None, role: str) -> str:
    return create_token(
        subject=user_id,
        claims={"tenant_id": tenant_id, "role": role, "type": "refresh"},
        expires_delta=timedelta(days=settings.refresh_token_days),
    )

