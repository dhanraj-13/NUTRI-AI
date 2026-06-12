from pathlib import Path

from fastapi import APIRouter, File, UploadFile

router = APIRouter(prefix="/upload", tags=["uploads"])


async def _save_upload(kind: str, file: UploadFile) -> dict:
    target_dir = Path("app/storage/uploads") / kind
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / file.filename
    content = await file.read()
    target.write_bytes(content)
    return {"filename": file.filename, "path": str(target), "bytes": len(content)}


@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    return await _save_upload("image", file)


@router.post("/meal")
async def upload_meal(file: UploadFile = File(...)):
    return await _save_upload("meal", file)


@router.post("/avatar")
async def upload_avatar(file: UploadFile = File(...)):
    return await _save_upload("avatar", file)
