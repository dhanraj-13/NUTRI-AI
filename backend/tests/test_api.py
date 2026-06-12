import os
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite:///./test_nutrition.db"
os.environ["JWT_SECRET"] = "test-secret"
os.environ["DATASET_ROOT"] = str(Path(__file__).resolve().parents[1] / "datasets")
os.environ["EXPORTS_ROOT"] = str(Path(__file__).resolve().parents[1] / "datasets" / "exports")

from fastapi.testclient import TestClient

from app.main import create_app


client = TestClient(create_app())


def test_health():
    response = client.get("/health")
    assert response.status_code == 200


def test_auth_and_profile_flow():
    reg = client.post("/api/register", json={"name": "Test User", "email": "user@example.com", "password": "password123"})
    assert reg.status_code == 200
    token = reg.json()["access_token"]

    profile = client.get("/api/profile", headers={"Authorization": f"Bearer {token}"})
    assert profile.status_code == 200
    assert profile.json()["email"] == "user@example.com"


def test_foods_endpoint():
    response = client.get("/api/foods")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
