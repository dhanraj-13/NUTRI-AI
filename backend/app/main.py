from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.api.monitoring import router as monitoring_router
from app.api.websocket import router as websocket_router
from app.core.config import settings
from app.core.db import Base, engine
from app.core.logger import configure_logging
from app.core.middleware import rate_limit_middleware, request_timing_middleware
from app.services.dataset_service import bootstrap_food_dataset
from app.rag.pipelines.rag_pipeline import get_rag_pipeline


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(title="NUTRI AI", version="1.0.0")
    app.middleware("http")(rate_limit_middleware)
    app.middleware("http")(request_timing_middleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.mount(
        "/nutrition_images",
        StaticFiles(directory=f"{settings.dataset_root}/nutrition_images"),
        name="nutrition_images",
    )
    app.include_router(api_router, prefix="/api")
    app.include_router(monitoring_router)
    app.include_router(websocket_router)

    @app.get("/")
    def root() -> dict:
        return {
            "service": "NUTRI AI Backend",
            "status": "running",
            "docs": "/docs",
            "health": "/health",
            "api": "/api",
        }

    @app.get("/health")
    def health() -> dict:
        return {"status": "ok", "service": "nutri-ai-backend"}

    @app.on_event("startup")
    def startup_event() -> None:
        try:
            Base.metadata.create_all(bind=engine)
            bootstrap_food_dataset()
        except Exception as exc:
            app.state.database_startup_error = str(exc)
        try:
            app.state.rag = get_rag_pipeline()
            app.state.rag.initialize()
        except Exception as exc:
            app.state.rag_startup_error = str(exc)

    return app


app = create_app()
