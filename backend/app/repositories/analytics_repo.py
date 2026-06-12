from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.entities import Analytics, NutritionLog


def latest_analytics(db: Session, user_id: int) -> Analytics | None:
    return db.execute(
        select(Analytics).where(Analytics.user_id == user_id).order_by(Analytics.created_at.desc())
    ).scalar_one_or_none()


def upsert_analytics(db: Session, user_id: int, payload: dict) -> Analytics:
    existing = latest_analytics(db, user_id)
    if existing:
        for k, v in payload.items():
            setattr(existing, k, v)
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing

    row = Analytics(user_id=user_id, created_at=datetime.utcnow(), **payload)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def list_logs(db: Session, user_id: int):
    return db.execute(select(NutritionLog).where(NutritionLog.user_id == user_id)).scalars().all()
