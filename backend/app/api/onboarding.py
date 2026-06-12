from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import db_dep, user_dep
from app.models.entities import UserPreference
from app.schemas.contracts import OnboardingIn

router = APIRouter(tags=["onboarding"])


@router.post("/onboarding")
def onboarding(payload: OnboardingIn, user=Depends(user_dep), db: Session = db_dep()):
    row = db.execute(select(UserPreference).where(UserPreference.user_id == user.id)).scalar_one_or_none()
    if row is None:
        row = UserPreference(user_id=user.id)
    row.goal = payload.goal
    row.activity_level = payload.activity_level
    row.diet_preference = payload.diet_preference
    row.hydration_goal = payload.hydration_goal
    row.allergies = payload.allergies
    row.productivity_goal = payload.productivity_goal
    db.add(row)
    db.commit()
    return {"success": True}


@router.get("/user/preferences")
def get_prefs(user=Depends(user_dep), db: Session = db_dep()):
    row = db.execute(select(UserPreference).where(UserPreference.user_id == user.id)).scalar_one_or_none()
    return row.__dict__ if row else {}


@router.put("/user/preferences")
def put_prefs(payload: OnboardingIn, user=Depends(user_dep), db: Session = db_dep()):
    return onboarding(payload, user, db)

