from __future__ import annotations

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.types import ASGIApp


class TenantMiddleware(BaseHTTPMiddleware):
    """
    Resolves tenant context from request. For REST calls we accept:
    - X-Tenant-ID header OR
    - tenant_id claim inside access token (preferred for app requests)
    """

    def __init__(self, app: ASGIApp) -> None:
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        tenant_id = request.headers.get("x-tenant-id")
        request.state.tenant_id = tenant_id
        response = await call_next(request)
        return response

