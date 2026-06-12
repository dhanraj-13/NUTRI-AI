from sqlalchemy import create_engine, text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings

def _to_sync_url(url: str) -> str:
    if url.startswith("sqlite+aiosqlite:///"):
        return url.replace("sqlite+aiosqlite:///", "sqlite:///")
    if url.startswith("postgresql+asyncpg://"):
        return url.replace("postgresql+asyncpg://", "postgresql://")
    return url


def _create_sync_engine(url: str):
    sync_url = _to_sync_url(url)
    connect_args = {"check_same_thread": False} if sync_url.startswith("sqlite") else {}
    return create_engine(sync_url, future=True, connect_args=connect_args)


def _create_memory_engine():
    return create_engine(
        "sqlite://",
        future=True,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )


engine = _create_sync_engine(settings.database_url)
database_startup_error: str | None = None
try:
    with engine.connect() as connection:
        connection.execute(text("select 1"))
except Exception as exc:
    database_startup_error = str(exc)
    engine = _create_memory_engine()

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()


def _to_async_url(url: str) -> str:
    if url.startswith("sqlite:///"):
        return url.replace("sqlite:///", "sqlite+aiosqlite:///")
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://")
    return url


try:
    async_engine = create_async_engine(_to_async_url(settings.database_url), future=True)
    AsyncSessionLocal = async_sessionmaker(bind=async_engine, expire_on_commit=False, autoflush=False)
except Exception:
    async_engine = None
    AsyncSessionLocal = None


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db():
    if AsyncSessionLocal is None:
        raise RuntimeError("Async database driver is not installed or configured")
    async with AsyncSessionLocal() as session:
        yield session
