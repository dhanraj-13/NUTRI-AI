from app.websocket.manager import manager


async def dispatch_event(event: str, payload: dict) -> None:
    await manager.broadcast({"event": event, "payload": payload})
