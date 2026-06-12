from loguru import logger
from pathlib import Path


def configure_logging() -> None:
    try:
        Path("logs").mkdir(exist_ok=True)
        logger.add("logs/backend.log", rotation="10 MB", retention="7 days", enqueue=False, backtrace=False)
    except Exception:
        logger.warning("file logging unavailable; continuing with console logging")


def get_logger():
    return logger
