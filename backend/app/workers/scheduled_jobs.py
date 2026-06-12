from app.core.db import SessionLocal
from app.services.dataset_service import bootstrap_food_dataset


def run_dataset_bootstrap_job() -> None:
    bootstrap_food_dataset()


def run_analytics_rebuild_job() -> None:
    with SessionLocal() as _db:
        # Placeholder for scheduled rebuilds.
        return None
