from app.workers.celery_worker import celery_app


if celery_app:
    @celery_app.task(name="rebuild_analytics")
    def rebuild_analytics(user_id: int) -> dict:
        return {"queued": True, "user_id": user_id}
else:
    def rebuild_analytics(user_id: int) -> dict:
        return {"queued": False, "user_id": user_id}
