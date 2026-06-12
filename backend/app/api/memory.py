from fastapi import APIRouter, Depends

from app.api.deps import user_dep
from app.rag.memory.conversation_memory import conversation_memory
from app.rag.memory.user_memory import user_memory

router = APIRouter(prefix="/memory", tags=["memory"])


@router.get("/history")
def memory_history(user=Depends(user_dep)):
    return {"history": conversation_memory.get(str(user.id))}


@router.get("/context")
def memory_context(user=Depends(user_dep)):
    return {
        "conversation": conversation_memory.get(str(user.id)),
        "preferences": user_memory.get_preferences(str(user.id)),
    }
