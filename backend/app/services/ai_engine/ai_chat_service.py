from app.rag.pipelines.rag_pipeline import get_rag_pipeline


class AIChatService:
    def answer(self, message: str, user_id: str = "anonymous") -> dict:
        return get_rag_pipeline().answer(query=message, user_id=user_id)
