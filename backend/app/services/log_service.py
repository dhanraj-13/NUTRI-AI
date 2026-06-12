import re
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.entities import NutritionLog
from app.repositories.nutrition_repo import get_food_by_name


def parse_serving_weight(serving_size_str: str) -> float:
    match = re.search(r'(\d+(?:\.\d+)?)\s*(?:g|ml)', serving_size_str, re.IGNORECASE)
    if match:
        return float(match.group(1))
    return 100.0


def create_log(db: Session, user_id: int, food_name: str, quantity: float, meal_type: str, meal_time):
    food = get_food_by_name(db, food_name)
    if not food:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Food not found")

    weight = parse_serving_weight(food.serving_size)
    factor = quantity / weight

    log = NutritionLog(
        user_id=user_id,
        food_name=food.food_name,
        quantity=quantity,
        calories=food.calories * factor,
        protein=food.protein * factor,
        carbs=food.carbs * factor,
        fats=food.fats * factor,
        meal_type=meal_type,
        meal_time=meal_time,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
