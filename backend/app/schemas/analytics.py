from pydantic import BaseModel


class AnalyticsSnapshot(BaseModel):
    calories_total: float = 0
    protein_total: float = 0
    carbs_total: float = 0
    fats_total: float = 0
    hydration_total: int = 0
    nutrition_score: float = 0
    productivity_score: float = 0
