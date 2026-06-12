from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.entities import NutritionFood, User


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.execute(select(User).where(User.email == email)).scalar_one_or_none()


def list_foods(db: Session, search: str | None, meal_type: str | None, limit: int, offset: int):
    query = select(NutritionFood)
    if search:
        query = query.where(NutritionFood.food_name.ilike(f"%{search}%"))
    if meal_type:
        query = query.where(NutritionFood.meal_type.ilike(meal_type))
    return db.execute(query.limit(limit).offset(offset)).scalars().all()


def get_food_by_name(db: Session, food_name: str) -> NutritionFood | None:
    return db.execute(select(NutritionFood).where(NutritionFood.food_name.ilike(food_name))).scalar_one_or_none()
