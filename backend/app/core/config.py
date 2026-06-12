from functools import lru_cache
from pathlib import Path
import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    app_name: str = "NUTRI AI"
    jwt_secret: str = os.getenv("JWT_SECRET", "dev-secret")
    jwt_expire_minutes: int = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))
    database_url: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./nutrition.db")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    cors_origins = ["*"]
    dataset_root: str = os.getenv("DATASET_ROOT", r"E:\dhanraj\AI productivity agent\dataset\nutrition_project")
    exports_root: str = os.getenv("EXPORTS_ROOT", r"E:\dhanraj\AI productivity agent\dataset\nutrition_project\exports")

    @property
    def dataset_csv(self) -> Path:
        return Path(self.dataset_root) / "nutrition_dataset_with_images.csv"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
