from app.rag.pipelines.rag_pipeline import get_rag_pipeline


class HydrationPipeline:
    def recommend(self, user_id: str = "anonymous") -> dict:
        return get_rag_pipeline().answer(query="hydration foods and drinks for productivity", user_id=user_id, top_k=6)
