from sqlalchemy import select
from app.repositories.analytics_repo import list_logs, upsert_analytics
from app.models.entities import HydrationLog


def compute_analytics(db, user_id: int):
    logs = list_logs(db, user_id)
    calories = sum(x.calories for x in logs)
    protein = sum(x.protein for x in logs)
    carbs = sum(x.carbs for x in logs)
    fats = sum(x.fats for x in logs)

    # Correctly query hydration logs
    hydration_logs = db.execute(select(HydrationLog).where(HydrationLog.user_id == user_id)).scalars().all()
    hydration = sum(hl.water_amount for hl in hydration_logs)

    nutrition_score = max(0.0, min(100.0, (protein * 0.5) + (hydration / 40) - abs(calories - 2200) * 0.02))
    productivity_score = max(0.0, min(100.0, nutrition_score * 0.8 + hydration / 100))

    return upsert_analytics(
        db,
        user_id,
        {
            "calories_total": calories,
            "protein_total": protein,
            "carbs_total": carbs,
            "fats_total": fats,
            "hydration_total": hydration,
            "nutrition_score": nutrition_score,
            "productivity_score": productivity_score,
        },
    )
