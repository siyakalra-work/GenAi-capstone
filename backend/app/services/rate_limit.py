from __future__ import annotations

import time
from collections import defaultdict

import redis.asyncio as redis
from fastapi import Request

from app.core.config import settings
from app.core.errors import http_403


class RateLimiter:
    def __init__(self) -> None:
        self.client = redis.from_url(settings.redis_url) if settings.redis_url else None
        self._memory_buckets: dict[str, dict[int, int]] = defaultdict(dict)

    async def check(self, request: Request, *, key_suffix: str) -> None:
        ip = request.client.host if request.client else "unknown"
        key = f"rl:{key_suffix}:{ip}"
        now_bucket = int(time.time() // 60)
        if self.client is not None:
            bucket_key = f"{key}:{now_bucket}"
            count = await self.client.incr(bucket_key)
            if count == 1:
                await self.client.expire(bucket_key, 70)
        else:
            count = self._memory_buckets[key].get(now_bucket, 0) + 1
            self._memory_buckets[key][now_bucket] = count
        if count > settings.rate_limit_per_minute:
            raise http_403("Rate limit exceeded")


rate_limiter = RateLimiter()
