from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.entities import User, UserPreference, UserProfile


class UserRepository:
    def get_by_email(self, db: Session, email: str) -> User | None:
        return db.execute(select(User).where(User.email == email)).scalar_one_or_none()

    def get_by_id(self, db: Session, user_id: int) -> User | None:
        return db.get(User, user_id)

    def get_preferences(self, db: Session, user_id: int) -> UserPreference | None:
        return db.execute(select(UserPreference).where(UserPreference.user_id == user_id)).scalar_one_or_none()

    def get_profile(self, db: Session, user_id: int) -> UserProfile | None:
        return db.execute(select(UserProfile).where(UserProfile.user_id == user_id)).scalar_one_or_none()
