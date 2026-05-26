from __future__ import annotations

import time

import redis.asyncio as redis
from fastapi import Request

from app.core.config import settings
from app.core.errors import http_403


class RateLimiter:
    def __init__(self) -> None:
        self.client = redis.from_url(settings.redis_url)

    async def check(self, request: Request, *, key_suffix: str) -> None:
        ip = request.client.host if request.client else "unknown"
        key = f"rl:{key_suffix}:{ip}"
        now_bucket = int(time.time() // 60)
        bucket_key = f"{key}:{now_bucket}"
        count = await self.client.incr(bucket_key)
        if count == 1:
            await self.client.expire(bucket_key, 70)
        if count > settings.rate_limit_per_minute:
            raise http_403("Rate limit exceeded")


rate_limiter = RateLimiter()

