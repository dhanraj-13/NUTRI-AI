from app.core.config import settings


def create_celery_app():
    try:
        from celery import Celery

        broker = getattr(settings, "redis_url", "redis://localhost:6379/0")
        app = Celery(
            "nutrition_backend",
            broker=broker,
            backend=broker,
            include=["app.workers.queue_tasks"],
        )
        app.conf.broker_connection_retry_on_startup = True
        app.conf.timezone = "Asia/Kolkata"
        app.conf.task_routes = {"app.workers.queue_tasks.*": {"queue": "nutrition"}}
        return app
    except Exception:
        return None


celery_app = create_celery_app()
