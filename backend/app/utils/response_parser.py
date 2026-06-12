def api_response(data=None, message: str = "ok", success: bool = True) -> dict:
    return {"success": success, "message": message, "data": data}
