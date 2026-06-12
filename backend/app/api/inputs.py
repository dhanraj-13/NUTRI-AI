from fastapi import APIRouter, Depends
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.api.deps import db_dep, user_dep
from app.models.entities import AISession, EnergyLog, HydrationLog, MoodLog, ReminderSetting, SleepLog, UserProfile
from app.rag.pipelines.rag_pipeline import get_rag_pipeline
from app.schemas.contracts import AIChatIn, EnergyIn, HydrationIn, MoodIn, ProfileIn, ReminderIn, SleepIn

router = APIRouter(tags=["inputs"])


@router.post("/hydration")
def hydration(payload: HydrationIn, user=Depends(user_dep), db: Session = db_dep()):
    score = min(100.0, payload.water_amount / 25)
    row = HydrationLog(user_id=user.id, water_amount=payload.water_amount, hydration_score=score)
    db.add(row)
    db.commit()
    return {"success": True, "hydration_score": score}


@router.get("/hydration")
def get_hydration(user=Depends(user_dep), db: Session = db_dep()):
    rows = db.execute(select(HydrationLog).where(HydrationLog.user_id == user.id)).scalars().all()
    return [r.__dict__ for r in rows]


@router.get("/hydration/analytics")
def hydration_analytics(user=Depends(user_dep), db: Session = db_dep()):
    from datetime import timedelta
    from sqlalchemy import select
    from app.models.entities import HydrationLog
    from app.api.deps import user_dep

    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)

    # Today's logs only
    today_rows = db.execute(
        select(HydrationLog)
        .where(HydrationLog.user_id == user.id)
        .where(HydrationLog.created_at >= today_start)
        .where(HydrationLog.created_at < today_end)
    ).scalars().all()
    total_today = sum(r.water_amount for r in today_rows)

    # Weekly average (last 7 days)
    week_start = today_start - timedelta(days=6)
    week_rows = db.execute(
        select(HydrationLog)
        .where(HydrationLog.user_id == user.id)
        .where(HydrationLog.created_at >= week_start)
    ).scalars().all()
    weekly_total = sum(r.water_amount for r in week_rows)
    weekly_avg = round(weekly_total / 7, 0)

    # Streak: count consecutive days with any hydration log
    streak = 0
    for offset in range(0, 30):
        d_start = today_start - timedelta(days=offset)
        d_end = d_start + timedelta(days=1)
        day_rows = db.execute(
            select(HydrationLog)
            .where(HydrationLog.user_id == user.id)
            .where(HydrationLog.created_at >= d_start)
            .where(HydrationLog.created_at < d_end)
        ).scalars().all()
        if day_rows:
            streak += 1
        else:
            break

    goal = 2500
    pct = min(100, round((total_today / goal) * 100))
    return {
        "total_today": total_today,
        "goal": goal,
        "percentage": pct,
        "streak_days": streak,
        "weekly_average": weekly_avg,
        "logs": [
            {
                "id": r.id,
                "water_amount": r.water_amount,
                "hydration_score": r.hydration_score,
                "logged_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in today_rows
        ],
    }



@router.post("/ai/chat")
def ai_chat(payload: AIChatIn, user=Depends(user_dep), db: Session = db_dep()):
    rag_result = get_rag_pipeline().answer(query=payload.prompt, user_id=str(user.id))
    response = rag_result["response"]
    row = AISession(user_id=user.id, prompt=payload.prompt, response=response)
    db.add(row)
    db.commit()
    return rag_result


@router.get("/ai/history")
def ai_history(user=Depends(user_dep), db: Session = db_dep()):
    rows = db.execute(select(AISession).where(AISession.user_id == user.id)).scalars().all()
    return [r.__dict__ for r in rows]


@router.delete("/ai/history")
def clear_ai_history(user=Depends(user_dep), db: Session = db_dep()):
    db.execute(delete(AISession).where(AISession.user_id == user.id))
    db.commit()
    return {"success": True}


@router.post("/energy-level")
def energy(payload: EnergyIn, user=Depends(user_dep), db: Session = db_dep()):
    db.add(EnergyLog(user_id=user.id, energy_level=payload.energy_level))
    db.commit()
    return {"success": True}


@router.get("/energy-analytics")
def energy_analytics(user=Depends(user_dep), db: Session = db_dep()):
    rows = db.execute(select(EnergyLog).where(EnergyLog.user_id == user.id)).scalars().all()
    return [r.energy_level for r in rows]


@router.post("/mood")
def mood(payload: MoodIn, user=Depends(user_dep), db: Session = db_dep()):
    db.add(MoodLog(user_id=user.id, mood=payload.mood))
    db.commit()
    return {"success": True}


@router.get("/mood-analytics")
def mood_analytics(user=Depends(user_dep), db: Session = db_dep()):
    rows = db.execute(select(MoodLog).where(MoodLog.user_id == user.id)).scalars().all()
    return [r.mood for r in rows]


@router.post("/sleep")
def sleep(payload: SleepIn, user=Depends(user_dep), db: Session = db_dep()):
    db.add(SleepLog(user_id=user.id, sleep_hours=payload.sleep_hours))
    db.commit()
    return {"success": True}


@router.get("/sleep-analytics")
def sleep_analytics(user=Depends(user_dep), db: Session = db_dep()):
    rows = db.execute(select(SleepLog).where(SleepLog.user_id == user.id)).scalars().all()
    avg = (sum(r.sleep_hours for r in rows) / len(rows)) if rows else 0
    return {"avg_sleep_hours": avg}


@router.post("/reminders")
def create_reminders(payload: ReminderIn, user=Depends(user_dep), db: Session = db_dep()):
    row = db.execute(select(ReminderSetting).where(ReminderSetting.user_id == user.id)).scalar_one_or_none()
    if row is None:
        row = ReminderSetting(user_id=user.id)
    row.meal_reminders = payload.meal_reminders
    row.hydration_reminders = payload.hydration_reminders
    row.ai_notifications = payload.ai_notifications
    db.add(row)
    db.commit()
    return {"success": True}


@router.get("/reminders")
def get_reminders(user=Depends(user_dep), db: Session = db_dep()):
    row = db.execute(select(ReminderSetting).where(ReminderSetting.user_id == user.id)).scalar_one_or_none()
    return row.__dict__ if row else {}


@router.put("/reminders")
def update_reminders(payload: ReminderIn, user=Depends(user_dep), db: Session = db_dep()):
    return create_reminders(payload, user, db)


@router.get("/profile")
def get_profile(user=Depends(user_dep), db: Session = db_dep()):
    row = db.execute(select(UserProfile).where(UserProfile.user_id == user.id)).scalar_one_or_none()
    if not row:
        return {}
    bmi = row.weight_kg / ((row.height_cm / 100) ** 2)
    return {**row.__dict__, "bmi": round(bmi, 2)}


@router.put("/profile")
def put_profile(payload: ProfileIn, user=Depends(user_dep), db: Session = db_dep()):
    row = db.execute(select(UserProfile).where(UserProfile.user_id == user.id)).scalar_one_or_none()
    if row is None:
        row = UserProfile(user_id=user.id)
    row.height_cm = payload.height_cm
    row.weight_kg = payload.weight_kg
    row.age = payload.age
    row.gender = payload.gender
    row.nutrition_goal = payload.nutrition_goal
    db.add(row)
    db.commit()
    return {"success": True}

