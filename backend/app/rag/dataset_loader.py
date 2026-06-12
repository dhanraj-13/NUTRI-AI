import csv
from pathlib import Path

from app.core.config import settings
from app.rag.chunking.nutrition_chunker import NutritionDocument


REQUIRED_COLUMNS = {
    "food_name",
    "calories",
    "protein",
    "carbs",
    "fats",
    "fiber",
    "serving_size",
    "food_category",
    "meal_type",
    "diet_type",
    "health_benefits",
    "image_path",
}


class NutritionDatasetLoader:
    def __init__(self, dataset_root: str | Path | None = None):
        self.dataset_root = Path(dataset_root or settings.dataset_root)
        self.csv_path = self.dataset_root / "nutrition_dataset_with_images.csv"

    def load_rows(self) -> list[dict]:
        if not self.csv_path.exists():
            raise FileNotFoundError(f"Nutrition dataset not found: {self.csv_path}")
        with self.csv_path.open("r", encoding="utf-8") as handle:
            rows = list(csv.DictReader(handle))
        if not rows:
            return []
        missing = REQUIRED_COLUMNS - set(rows[0].keys())
        if missing:
            raise ValueError(f"Nutrition dataset missing columns: {sorted(missing)}")
        return [self._clean_row(row) for row in rows]

    def to_documents(self) -> list[NutritionDocument]:
        return [self._row_to_document(row) for row in self.load_rows()]

    def _clean_row(self, row: dict) -> dict:
        cleaned = {key: str(value or "").strip() for key, value in row.items()}
        for key in ("calories", "protein", "carbs", "fats", "fiber", "hydration_score", "satiety_score"):
            if key in cleaned:
                cleaned[key] = float(cleaned[key] or 0)
        cleaned.setdefault("hydration_score", 5.0)
        cleaned.setdefault("satiety_score", 5.0)
        return cleaned

    def _row_to_document(self, row: dict) -> NutritionDocument:
        text = (
            f"Food Name: {row['food_name']}\n"
            f"Calories: {row['calories']}\n"
            f"Protein: {row['protein']}g\n"
            f"Carbs: {row['carbs']}g\n"
            f"Fats: {row['fats']}g\n"
            f"Fiber: {row['fiber']}g\n"
            f"Serving Size: {row['serving_size']}\n"
            f"Category: {row['food_category']}\n"
            f"Meal Type: {row['meal_type']}\n"
            f"Diet Type: {row['diet_type']}\n"
            f"Hydration Score: {row.get('hydration_score', 5.0)}\n"
            f"Satiety Score: {row.get('satiety_score', 5.0)}\n"
            f"Benefits: {row['health_benefits']}"
        )
        return NutritionDocument(text=text, metadata=row)
