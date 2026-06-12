from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import db_dep, user_dep
from app.models.entities import Analytics, NutritionLog
from app.repositories.analytics_repo import latest_analytics

router = APIRouter(tags=["analytics"])


def _get_weekly_daily_series(db: Session, user_id: int, field: str) -> list[float]:
    """Build a 7-element list with per-day sums for the past 7 days (oldest→newest)."""
    result = []
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    for offset in range(6, -1, -1):
        day_start = today - timedelta(days=offset)
        day_end = day_start + timedelta(days=1)
        rows = db.execute(
            select(NutritionLog)
            .where(NutritionLog.user_id == user_id)
            .where(NutritionLog.meal_time >= day_start)
            .where(NutritionLog.meal_time < day_end)
        ).scalars().all()
        total = sum(getattr(r, field, 0.0) or 0.0 for r in rows)
        result.append(round(total, 2))
    return result


@router.get("/analytics")
def analytics(user=Depends(user_dep), db: Session = db_dep()):
    """
    Return today's analytics for the dashboard.
    Includes weekly series for chart rendering.
    Field names use `calories_consumed` alias for dashboard compatibility.
    """
    record = latest_analytics(db, user.id)

    weekly_calories = _get_weekly_daily_series(db, user.id, "calories")
    weekly_hydration = []  # hydration series computed separately for performance

    if record is None:
        return {
            "calories_consumed": 0,
            "protein_total": 0,
            "carbs_total": 0,
            "fats_total": 0,
            "hydration_score": 0,
            "nutrition_score": 0,
            "productivity_score": 0,
            "macro_distribution": {"protein": 0, "carbs": 0, "fats": 0},
            "meal_consistency": 0,
            "ai_insights": [],
            "weekly_calories": weekly_calories,
            "weekly_hydration": [0, 0, 0, 0, 0, 0, 0],
        }

    total = (record.protein_total or 0) + (record.carbs_total or 0) + (record.fats_total or 0)
    macro_dist = {
        "protein": round((record.protein_total / total * 100) if total > 0 else 0, 1),
        "carbs": round((record.carbs_total / total * 100) if total > 0 else 0, 1),
        "fats": round((record.fats_total / total * 100) if total > 0 else 0, 1),
    }

    return {
        # `calories_consumed` alias used by frontend dashboard widget
        "calories_consumed": round(record.calories_total or 0, 2),
        "protein_total": round(record.protein_total or 0, 2),
        "carbs_total": round(record.carbs_total or 0, 2),
        "fats_total": round(record.fats_total or 0, 2),
        "hydration_score": round(
            min(100.0, (record.hydration_total or 0) / 25), 1
        ),
        "nutrition_score": round(record.nutrition_score or 0, 1),
        "productivity_score": round(record.productivity_score or 0, 1),
        "macro_distribution": macro_dist,
        "meal_consistency": 0,
        "ai_insights": [],
        "weekly_calories": weekly_calories,
        "weekly_hydration": [0, 0, 0, 0, 0, 0, round(record.hydration_total or 0, 0)],
    }


@router.get("/macro-analysis")
def macro_analysis(user=Depends(user_dep), db: Session = db_dep()):
    """Return macro totals vs goals for the nutrition sidebar."""
    record = latest_analytics(db, user.id)
    if record is None:
        return {
            "protein": 0,
            "carbs": 0,
            "fats": 0,
            "fiber": 0,
            "protein_goal": 150,
            "carbs_goal": 250,
            "fats_goal": 70,
            "calories": 0,
            "calories_goal": 2200,
        }
    return {
        "protein": round(record.protein_total or 0, 2),
        "carbs": round(record.carbs_total or 0, 2),
        "fats": round(record.fats_total or 0, 2),
        "fiber": 0,
        "protein_goal": 150,
        "carbs_goal": 250,
        "fats_goal": 70,
        "calories": round(record.calories_total or 0, 2),
        "calories_goal": 2200,
    }


@router.get("/analytics/history")
def analytics_history(days: int = 30, user=Depends(user_dep), db: Session = db_dep()):
    """Return per-day calorie and protein totals for the past N days."""
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    result = []
    for offset in range(days - 1, -1, -1):
        day_start = today - timedelta(days=offset)
        day_end = day_start + timedelta(days=1)
        rows = db.execute(
            select(NutritionLog)
            .where(NutritionLog.user_id == user.id)
            .where(NutritionLog.meal_time >= day_start)
            .where(NutritionLog.meal_time < day_end)
        ).scalars().all()
        result.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "calories": round(sum(r.calories or 0 for r in rows), 2),
            "protein": round(sum(r.protein or 0 for r in rows), 2),
            "carbs": round(sum(r.carbs or 0 for r in rows), 2),
            "fats": round(sum(r.fats or 0 for r in rows), 2),
            "meal_count": len(rows),
        })
    return result
