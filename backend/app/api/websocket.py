from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import manager

router = APIRouter(tags=["websocket"])


async def _websocket_loop(websocket: WebSocket, channel: str):
    await manager.connect(websocket)
    try:
        await websocket.send_json({"event": "connected", "channel": channel})
        while True:
            message = await websocket.receive_text()
            await manager.broadcast({"event": "echo", "channel": channel, "message": message})
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@router.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
    await _websocket_loop(websocket, "default")


@router.websocket("/ws/live")
async def ws_live(websocket: WebSocket):
    await _websocket_loop(websocket, "live")


@router.websocket("/ws/analytics")
async def ws_analytics(websocket: WebSocket):
    await _websocket_loop(websocket, "analytics")


@router.websocket("/ws/ai-stream")
async def ws_ai_stream(websocket: WebSocket):
    await _websocket_loop(websocket, "ai-stream")
