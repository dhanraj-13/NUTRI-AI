from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import db_dep, user_dep
from app.schemas.contracts import LoginIn, RegisterIn, TokenOut
from app.services.auth_service import login_user, register_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut)
def register(payload: RegisterIn, db: Session = db_dep()):
    token = register_user(db, payload.name, payload.email, payload.password, payload.confirm_password)
    return TokenOut(access_token=token)


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = db_dep()):
    token = login_user(db, payload.email, payload.password)
    return TokenOut(access_token=token)


@router.post("/token", response_model=TokenOut)
def token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = db_dep()):
    access_token = login_user(db, form_data.username, form_data.password)
    return TokenOut(access_token=access_token)


@router.post("/logout")
def logout():
    return {"success": True, "message": "Logout successful"}


@router.get("/profile")
def profile(user=Depends(user_dep)):
    return {"id": user.id, "name": user.name, "email": user.email}
