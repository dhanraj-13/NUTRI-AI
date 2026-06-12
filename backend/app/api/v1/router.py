from fastapi import APIRouter

from app.api.ai import router as ai_router
from app.api.analytics import router as analytics_router
from app.api.auth import router as auth_router
from app.api.foods import router as foods_router
from app.api.inputs import router as inputs_router
from app.api.memory import router as memory_router
from app.api.monitoring import router as monitoring_router
from app.api.onboarding import router as onboarding_router
from app.api.nutrition import router as nutrition_router
from app.api.uploads import router as uploads_router
from app.api.websocket import router as websocket_router

v1_router = APIRouter(prefix="/v1")
v1_router.include_router(auth_router)
v1_router.include_router(foods_router)
v1_router.include_router(nutrition_router)
v1_router.include_router(ai_router)
v1_router.include_router(analytics_router)
v1_router.include_router(inputs_router)
v1_router.include_router(onboarding_router)
v1_router.include_router(memory_router)
v1_router.include_router(uploads_router)
v1_router.include_router(monitoring_router)
v1_router.include_router(websocket_router)
