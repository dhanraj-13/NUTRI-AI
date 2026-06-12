from app.core.config import settings
from app.core import db as database


def health_snapshot() -> dict:
    return {
        "service": settings.app_name,
        "dataset_root": settings.dataset_root,
        "postgres_configured": settings.database_url.startswith("postgresql"),
        "database_mode": "fallback-sqlite-memory" if database.database_startup_error else "configured",
        "database_startup_error": database.database_startup_error,
        "redis_configured": bool(settings.redis_url),
        "openai_configured": bool(settings.openai_api_key),
    }
