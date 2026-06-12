from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

from app.cache.redis_cache import redis_cache
from app.monitoring.healthcheck import health_snapshot
from app.monitoring.metrics import metrics
from app.rag.pipelines.rag_pipeline import get_rag_pipeline
from app.workers.celery_worker import celery_app

router = APIRouter(tags=["monitoring"])


@router.get("/system-health")
def system_health():
    return health_snapshot()


@router.get("/ai-health")
def ai_health():
    pipeline = get_rag_pipeline()
    pipeline.initialize()
    return {"rag_initialized": pipeline._initialized, "openai_mode": False}


@router.get("/cache-health")
def cache_health():
    redis_cache.set("cache-health", {"ok": True}, ttl_seconds=10)
    return {"cache": redis_cache.get("cache-health"), "mode": "redis" if redis_cache._client else "memory"}


@router.get("/metrics", response_class=PlainTextResponse)
def prometheus_metrics():
    lines = [f'app_counter_total{{name="{name}"}} {value}' for name, value in metrics.counters.items()]
    return "\n".join(lines) or "app_counter_total 0"


@router.get("/worker-health")
def worker_health():
    return {"celery_configured": celery_app is not None}
