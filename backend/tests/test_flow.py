import os
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite:///./test_nutrition.db"
os.environ["JWT_SECRET"] = "test-secret"
os.environ["DATASET_ROOT"] = str(Path(__file__).resolve().parents[1] / "datasets")
os.environ["EXPORTS_ROOT"] = str(Path(__file__).resolve().parents[1] / "datasets" / "exports")

from fastapi.testclient import TestClient

from app.main import create_app


client = TestClient(create_app())


def create_user_token():
    reg = client.post("/api/register", json={"name": "Flow User", "email": "flow@example.com", "password": "password123"})
    return reg.json()["access_token"]


def test_log_recommendation_analytics_export_flow():
    token = create_user_token()
    foods = client.get("/api/foods").json()
    if not foods:
        return

    log = client.post(
        "/api/nutrition-log",
        headers={"Authorization": f"Bearer {token}"},
        json={"food_id": foods[0]["id"], "quantity": 1.0, "hydration_ml": 300, "meal_type": "breakfast"},
    )
    assert log.status_code == 200

    rec = client.get("/api/recommendations", headers={"Authorization": f"Bearer {token}"})
    assert rec.status_code == 200

    analytics = client.get("/api/analytics", headers={"Authorization": f"Bearer {token}"})
    assert analytics.status_code == 200

    export = client.post("/api/exports", headers={"Authorization": f"Bearer {token}"})
    assert export.status_code == 200
