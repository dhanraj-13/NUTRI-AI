from app.rag.pipelines.rag_pipeline import get_rag_pipeline


class RecommendationPipeline:
    def recommend(self, goal: str, user_id: str = "anonymous") -> dict:
        query = f"personalized nutrition recommendation for {goal}"
        return get_rag_pipeline().answer(query=query, user_id=user_id, top_k=6)
