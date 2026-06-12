from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class UserPreference(Base):
    __tablename__ = "user_preferences"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
    goal: Mapped[str] = mapped_column(String(120), default="Healthy Lifestyle")
    activity_level: Mapped[str] = mapped_column(String(120), default="Moderate")
    diet_preference: Mapped[str] = mapped_column(String(120), default="Balanced")
    hydration_goal: Mapped[int] = mapped_column(Integer, default=2500)
    allergies: Mapped[str] = mapped_column(Text, default="")
    productivity_goal: Mapped[str] = mapped_column(String(120), default="Better Focus")


class UserProfile(Base):
    __tablename__ = "user_profiles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
    height_cm: Mapped[float] = mapped_column(Float, default=170)
    weight_kg: Mapped[float] = mapped_column(Float, default=70)
    age: Mapped[int] = mapped_column(Integer, default=25)
    gender: Mapped[str] = mapped_column(String(30), default="Not specified")
    nutrition_goal: Mapped[str] = mapped_column(String(120), default="Maintain")


class ReminderSetting(Base):
    __tablename__ = "reminder_settings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
    meal_reminders: Mapped[str] = mapped_column(Text, default="08:00,13:00,20:00")
    hydration_reminders: Mapped[str] = mapped_column(Text, default="10:00,12:00,15:00,18:00")
    ai_notifications: Mapped[bool] = mapped_column(default=True)


class NutritionFood(Base):
    __tablename__ = "nutrition_foods"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    food_name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    calories: Mapped[float] = mapped_column(Float, nullable=False)
    protein: Mapped[float] = mapped_column(Float, nullable=False)
    carbs: Mapped[float] = mapped_column(Float, nullable=False)
    fats: Mapped[float] = mapped_column(Float, nullable=False)
    fiber: Mapped[float] = mapped_column(Float, nullable=False)
    serving_size: Mapped[str] = mapped_column(String(120), nullable=False)
    food_category: Mapped[str] = mapped_column(String(120), index=True)
    meal_type: Mapped[str] = mapped_column(String(120), index=True)
    diet_type: Mapped[str] = mapped_column(String(120), index=True)
    hydration_score: Mapped[float] = mapped_column(Float, default=5.0)
    satiety_score: Mapped[float] = mapped_column(Float, default=5.0)
    health_benefits: Mapped[str] = mapped_column(Text, default="")
    image_path: Mapped[str] = mapped_column(String(255), default="")


class NutritionLog(Base):
    __tablename__ = "nutrition_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    food_name: Mapped[str] = mapped_column(String(255), index=True)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    calories: Mapped[float] = mapped_column(Float, nullable=False)
    protein: Mapped[float] = mapped_column(Float, nullable=False)
    carbs: Mapped[float] = mapped_column(Float, nullable=False)
    fats: Mapped[float] = mapped_column(Float, nullable=False)
    meal_type: Mapped[str] = mapped_column(String(120), nullable=False)
    meal_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class HydrationLog(Base):
    __tablename__ = "hydration_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    water_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    hydration_score: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class EnergyLog(Base):
    __tablename__ = "energy_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    energy_level: Mapped[str] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class MoodLog(Base):
    __tablename__ = "mood_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    mood: Mapped[str] = mapped_column(String(30))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SleepLog(Base):
    __tablename__ = "sleep_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    sleep_hours: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AISession(Base):
    __tablename__ = "ai_sessions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    prompt: Mapped[str] = mapped_column(Text)
    response: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    recommendation_type: Mapped[str] = mapped_column(String(120), index=True)
    summary: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Analytics(Base):
    __tablename__ = "analytics"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    calories_total: Mapped[float] = mapped_column(Float, default=0)
    protein_total: Mapped[float] = mapped_column(Float, default=0)
    carbs_total: Mapped[float] = mapped_column(Float, default=0)
    fats_total: Mapped[float] = mapped_column(Float, default=0)
    hydration_total: Mapped[int] = mapped_column(Integer, default=0)
    nutrition_score: Mapped[float] = mapped_column(Float, default=0)
    productivity_score: Mapped[float] = mapped_column(Float, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
