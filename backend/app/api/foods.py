from fastapi import APIRouter
from sqlalchemy import select, or_
from sqlalchemy.orm import Session

from app.api.deps import db_dep
from app.models.entities import NutritionFood

router = APIRouter(prefix="/foods", tags=["foods"])


@router.get("")
def food_list(
    q: str | None = None,
    diet_type: str | None = None,
    food_category: str | None = None,
    page: int = 1,
    limit: int = 20,
    db: Session = db_dep(),
):
    offset = max(0, (page - 1) * limit)
    query = select(NutritionFood)
    
    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.where(
            or_(
                NutritionFood.food_name.ilike(term),
                NutritionFood.food_category.ilike(term),
                NutritionFood.health_benefits.ilike(term),
            )
        )
        
    if diet_type and diet_type.lower() != "all":
        query = query.where(NutritionFood.diet_type.ilike(diet_type))
        
    if food_category and food_category.lower() != "all":
        query = query.where(NutritionFood.food_category.ilike(food_category))
        
    rows = db.execute(
        query.order_by(NutritionFood.food_name)
        .offset(offset)
        .limit(limit)
    ).scalars().all()
    
    return [r.__dict__ for r in rows]


@router.get("/categories")
def food_categories(db: Session = db_dep()):
    rows = db.execute(select(NutritionFood.food_category).distinct()).scalars().all()
    return sorted([r for r in rows if r])


@router.get("/diet-types")
def food_diet_types(db: Session = db_dep()):
    rows = db.execute(select(NutritionFood.diet_type).distinct()).scalars().all()
    return sorted([r for r in rows if r])


@router.get("/search")
def food_search(q: str, page: int = 1, limit: int = 20, db: Session = db_dep()):
    offset = max(0, (page - 1) * limit)
    term = f"%{q}%"
    rows = db.execute(
        select(NutritionFood)
        .where(
            or_(
                NutritionFood.food_name.ilike(term),
                NutritionFood.food_category.ilike(term),
                NutritionFood.health_benefits.ilike(term),
            )
        )
        .order_by(NutritionFood.food_name)
        .offset(offset)
        .limit(limit)
    ).scalars().all()
    return [r.__dict__ for r in rows]


@router.get("/filter")
def food_filter(
    min_calories: float = 0,
    max_calories: float = 10000,
    min_protein: float = 0,
    meal_type: str | None = None,
    diet_type: str | None = None,
    food_category: str | None = None,
    db: Session = db_dep(),
):
    query = select(NutritionFood).where(
        NutritionFood.calories >= min_calories,
        NutritionFood.calories <= max_calories,
        NutritionFood.protein >= min_protein,
    )
    if meal_type:
        query = query.where(NutritionFood.meal_type.ilike(meal_type))
    if diet_type:
        query = query.where(NutritionFood.diet_type.ilike(diet_type))
    if food_category:
        query = query.where(NutritionFood.food_category.ilike(food_category))
    rows = db.execute(query.limit(100)).scalars().all()
    return [r.__dict__ for r in rows]


@router.get("/{food_id}")
def food_by_id(food_id: int, db: Session = db_dep()):
    row = db.get(NutritionFood, food_id)
    return row.__dict__ if row else {}
