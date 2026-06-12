from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=120)
    confirm_password: str = Field(min_length=8, max_length=120)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class OnboardingIn(BaseModel):
    goal: str
    activity_level: str
    diet_preference: str
    hydration_goal: int = Field(ge=500, le=6000)
    allergies: str = ""
    productivity_goal: str


class NutritionLogIn(BaseModel):
    food_name: str
    quantity: float = Field(gt=0)
    meal_type: str
    meal_time: datetime | None = None


class HydrationIn(BaseModel):
    water_amount: int = Field(ge=50, le=3000)


class AIChatIn(BaseModel):
    prompt: str = Field(min_length=2, max_length=2000)


class RAGChatIn(BaseModel):
    message: str = Field(min_length=2, max_length=2000)
    top_k: int = Field(default=5, ge=1, le=20)


class EnergyIn(BaseModel):
    energy_level: str


class MoodIn(BaseModel):
    mood: str


class SleepIn(BaseModel):
    sleep_hours: float = Field(ge=0, le=24)


class ReminderIn(BaseModel):
    meal_reminders: str
    hydration_reminders: str
    ai_notifications: bool


class ProfileIn(BaseModel):
    height_cm: float = Field(gt=50, lt=260)
    weight_kg: float = Field(gt=20, lt=350)
    age: int = Field(gt=5, lt=120)
    gender: str
    nutrition_goal: str
