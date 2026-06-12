import csv
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.db import SessionLocal
from app.models.entities import NutritionFood


def bootstrap_food_dataset() -> None:
    with SessionLocal() as db:
        existing = db.execute(select(NutritionFood.id)).first()
        if existing:
            return
        csv_path = settings.dataset_csv
        if not csv_path.exists():
            return

        with csv_path.open("r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                db.add(
                    NutritionFood(
                        food_name=row["food_name"],
                        calories=float(row["calories"]),
                        protein=float(row["protein"]),
                        carbs=float(row["carbs"]),
                        fats=float(row["fats"]),
                        fiber=float(row["fiber"]),
                        serving_size=row["serving_size"],
                        food_category=row["food_category"],
                        meal_type=row["meal_type"],
                        diet_type=row["diet_type"],
                        hydration_score=float(row.get("hydration_score", 5) or 5),
                        satiety_score=float(row.get("satiety_score", 5) or 5),
                        health_benefits=row.get("health_benefits", ""),
                        image_path=row.get("image_path", ""),
                    )
                )
            db.commit()


def export_csv(path: Path, headers: list[str], rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)
