import asyncio

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import db_dep, user_dep
from app.orchestrator.ai_pipeline import orchestrator
from app.rag.pipelines.rag_pipeline import get_rag_pipeline
from app.repositories.analytics_repo import latest_analytics
from app.schemas.contracts import RAGChatIn

router = APIRouter(tags=["ai"])


@router.get("/recommendations")
def recommendations(user=Depends(user_dep), db: Session = db_dep()):
    analytics = latest_analytics(db, user.id)
    if analytics is None:
        return {"recommendation_type": "baseline", "summary": "Log meals and hydration to generate personalized recommendations."}
    payload = orchestrator.run(db, user.id, analytics)
    rec = payload["recommendation"]
    return {"recommendation_type": rec.recommendation_type, "summary": rec.summary}


@router.post("/ai/chat")
def rag_chat(payload: RAGChatIn, user=Depends(user_dep)):
    return get_rag_pipeline().answer(query=payload.message, user_id=str(user.id), top_k=payload.top_k)


@router.post("/ai/chat/stream")
async def rag_chat_stream(payload: RAGChatIn, user=Depends(user_dep)):
    result = get_rag_pipeline().answer(query=payload.message, user_id=str(user.id), top_k=payload.top_k)

    async def stream_response():
        for token in result["response"].split():
            yield f"data: {token}\n\n"
            await asyncio.sleep(0.01)
        yield "data: [DONE]\n\n"

    return StreamingResponse(stream_response(), media_type="text/event-stream")


@router.get("/rag/search")
def rag_search(q: str, top_k: int = 5):
    return get_rag_pipeline().answer(query=q, user_id="search", top_k=top_k)


@router.get("/rag/debug")
def rag_debug():
    pipeline = get_rag_pipeline()
    pipeline.initialize()
    return {
        "initialized": pipeline._initialized,
        "index_dir": str(pipeline.index_dir),
        "documents": len(pipeline.retriever.store.documents) if pipeline.retriever else 0,
    }


@router.get("/rag/chunks")
def rag_chunks(limit: int = 20):
    pipeline = get_rag_pipeline()
    pipeline.initialize()
    docs = pipeline.retriever.store.documents if pipeline.retriever else []
    return [{"text": doc.text, "metadata": doc.metadata} for doc in docs[:limit]]


@router.get("/rag/vector-health")
def rag_vector_health():
    pipeline = get_rag_pipeline()
    pipeline.initialize()
    count = len(pipeline.retriever.store.embeddings) if pipeline.retriever else 0
    return {"status": "ok" if count else "empty", "vectors": count}
