from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.api.deps import db_dep, user_dep
from app.core.logger import get_logger
from app.models.entities import NutritionLog
from app.schemas.contracts import NutritionLogIn
from app.services.analytics_service import compute_analytics
from app.services.log_service import create_log
from app.websocket.manager import manager

logger = get_logger()
router = APIRouter(tags=["nutrition"])


def _serialize_log(row: NutritionLog) -> dict:
    """Safe serialization of NutritionLog — strips SQLAlchemy internal state."""
    return {
        "id": row.id,
        "user_id": row.user_id,
        "food_name": row.food_name,
        "quantity": row.quantity,
        "calories": round(row.calories, 2) if row.calories else 0.0,
        "protein": round(row.protein, 2) if row.protein else 0.0,
        "carbs": round(row.carbs, 2) if row.carbs else 0.0,
        "fats": round(row.fats, 2) if row.fats else 0.0,
        "meal_type": row.meal_type,
        "meal_time": row.meal_time.isoformat() if row.meal_time else None,
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


@router.post("/nutrition-log")
async def add_log(payload: NutritionLogIn, user=Depends(user_dep), db: Session = db_dep()):
    """
    Log a meal for the authenticated user.
    - Validates food exists in nutrition_foods table
    - Scales macros by quantity vs serving size
    - Persists NutritionLog record
    - Recalculates and upserts Analytics record
    - Broadcasts WebSocket event to all live sessions
    """
    logger.info(f"Nutrition log request: user={user.id} food='{payload.food_name}' qty={payload.quantity}g meal={payload.meal_type}")

    row = create_log(
        db,
        user.id,
        payload.food_name,
        payload.quantity,
        payload.meal_type,
        payload.meal_time or datetime.utcnow(),
    )

    analytics = compute_analytics(db, user.id)

    logger.info(f"Meal logged: log_id={row.id} calories={row.calories:.1f} nutrition_score={analytics.nutrition_score:.1f}")

    # Broadcast real-time WebSocket update to all connected sessions
    await manager.broadcast({
        "event": "nutrition_log_added",
        "user_id": user.id,
        "log_id": row.id,
        "food_name": row.food_name,
        "calories": round(row.calories, 2),
        "analytics_score": round(analytics.nutrition_score, 2),
        "calories_total": round(analytics.calories_total, 2),
        "protein_total": round(analytics.protein_total, 2),
    })

    return {
        "success": True,
        "log": _serialize_log(row),
        "analytics_score": round(analytics.nutrition_score, 2),
        "calories_total": round(analytics.calories_total, 2),
    }


@router.get("/nutrition-log")
def get_logs(user=Depends(user_dep), db: Session = db_dep()):
    """Return all nutrition logs for the authenticated user, newest first."""
    rows = db.execute(
        select(NutritionLog)
        .where(NutritionLog.user_id == user.id)
        .order_by(NutritionLog.meal_time.desc())
    ).scalars().all()
    return [_serialize_log(r) for r in rows]


@router.get("/nutrition-log/today")
def get_today_logs(user=Depends(user_dep), db: Session = db_dep()):
    """Return only today's nutrition logs for the authenticated user."""
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    rows = db.execute(
        select(NutritionLog)
        .where(NutritionLog.user_id == user.id)
        .where(NutritionLog.meal_time >= today_start)
        .order_by(NutritionLog.meal_time.desc())
    ).scalars().all()
    return [_serialize_log(r) for r in rows]


@router.put("/nutrition-log/{log_id}")
async def update_log(log_id: int, payload: NutritionLogIn, user=Depends(user_dep), db: Session = db_dep()):
    row = db.get(NutritionLog, log_id)
    if not row or row.user_id != user.id:
        return {"success": False, "message": "Not found"}

    row.food_name = payload.food_name
    row.quantity = payload.quantity
    row.meal_type = payload.meal_type
    row.meal_time = payload.meal_time or row.meal_time
    db.add(row)
    db.commit()
    db.refresh(row)

    analytics = compute_analytics(db, user.id)

    await manager.broadcast({
        "event": "nutrition_log_updated",
        "user_id": user.id,
        "log_id": row.id,
        "analytics_score": round(analytics.nutrition_score, 2),
    })

    return {"success": True, "log": _serialize_log(row)}


@router.delete("/nutrition-log/{log_id}")
async def delete_log(log_id: int, user=Depends(user_dep), db: Session = db_dep()):
    row = db.get(NutritionLog, log_id)
    if not row or row.user_id != user.id:
        return {"success": False, "message": "Not found"}

    db.execute(delete(NutritionLog).where(NutritionLog.id == log_id))
    db.commit()

    analytics = compute_analytics(db, user.id)

    await manager.broadcast({
        "event": "nutrition_log_deleted",
        "user_id": user.id,
        "log_id": log_id,
        "analytics_score": round(analytics.nutrition_score, 2),
    })

    return {"success": True}
