from __future__ import annotations

from typing import Any

from app.core.config import settings


class QdrantClientStub:
    async def upsert(self, *, collection: str, points: list[dict[str, Any]]) -> None:
        _ = collection, points

    async def search(self, *, collection: str, tenant_id: str, query: str, limit: int) -> list[dict]:
        _ = collection, tenant_id, query, limit
        return []


qdrant = QdrantClientStub()


def collection_name(tenant_id: str) -> str:
    return f"tenant_{tenant_id}_kb"

