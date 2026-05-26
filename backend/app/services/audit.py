from __future__ import annotations

import json
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit_log import AuditLog


async def write_audit(
    db: AsyncSession,
    *,
    tenant_id: str | None,
    actor_user_id: str | None,
    action: str,
    entity: str | None = None,
    entity_id: str | None = None,
    metadata: dict | None = None,
) -> None:
    row = AuditLog(
        id=str(uuid4()),
        tenant_id=tenant_id,
        actor_user_id=actor_user_id,
        action=action,
        entity=entity,
        entity_id=entity_id,
        metadata_json=json.dumps(metadata or {}),
    )
    db.add(row)
    await db.commit()

