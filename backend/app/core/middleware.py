import time
from collections import defaultdict, deque
from collections.abc import Awaitable, Callable

from fastapi import Request
from starlette.responses import JSONResponse, Response

from app.core.logger import get_logger


async def request_timing_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = round((time.perf_counter() - start) * 1000, 2)
    response.headers["X-Process-Time-Ms"] = str(duration_ms)
    get_logger().info("request", path=request.url.path, status=response.status_code, duration_ms=duration_ms)
    return response


_rate_windows: dict[str, deque[float]] = defaultdict(deque)


async def rate_limit_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    now = time.time()
    key = f"{request.client.host if request.client else 'unknown'}:{request.url.path}"
    window = _rate_windows[key]
    while window and now - window[0] > 60:
        window.popleft()
    limit = 30 if "/ai/" in request.url.path else 120
    if len(window) >= limit:
        return JSONResponse({"detail": "Rate limit exceeded"}, status_code=429)
    window.append(now)
    return await call_next(request)
