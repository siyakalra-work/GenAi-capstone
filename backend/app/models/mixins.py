from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class IdMixin:
    id: Mapped[str] = mapped_column(String(36), primary_key=True)


class TenantMixin:
    tenant_id: Mapped[str] = mapped_column(String(36), index=True, nullable=False)


def now_utc() -> datetime:
    return datetime.now(UTC)

