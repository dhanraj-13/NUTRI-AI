import json
from typing import Any

from app.core.config import settings
from app.core.logger import get_logger


class RedisCache:
    def __init__(self) -> None:
        self._client = None
        self._fallback: dict[str, str] = {}
        try:
            import redis

            redis_url = getattr(settings, "redis_url", "")
            if redis_url:
                self._client = redis.from_url(redis_url, decode_responses=True)
        except Exception as exc:
            get_logger().warning("redis unavailable, using memory cache", error=str(exc))

    def get(self, key: str) -> Any:
        try:
            raw = self._client.get(key) if self._client else self._fallback.get(key)
        except Exception as exc:
            get_logger().warning("redis get failed, using memory cache", error=str(exc))
            self._client = None
            raw = self._fallback.get(key)
        return json.loads(raw) if raw else None

    def set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        raw = json.dumps(value, default=str)
        try:
            if self._client:
                self._client.setex(key, ttl_seconds, raw)
                return
        except Exception as exc:
            get_logger().warning("redis set failed, using memory cache", error=str(exc))
            self._client = None
            self._fallback[key] = raw
            return
        self._fallback[key] = raw

    def delete(self, key: str) -> None:
        try:
            if self._client:
                self._client.delete(key)
                return
        except Exception as exc:
            get_logger().warning("redis delete failed, using memory cache", error=str(exc))
            self._client = None
            self._fallback.pop(key, None)
            return
        self._fallback.pop(key, None)


redis_cache = RedisCache()
