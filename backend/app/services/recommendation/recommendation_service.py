from app.rag.pipelines.recommendation_pipeline import RecommendationPipeline


class RecommendationService:
    def __init__(self) -> None:
        self.pipeline = RecommendationPipeline()

    def recommend_for_goal(self, goal: str, user_id: str = "anonymous") -> dict:
        return self.pipeline.recommend(goal=goal, user_id=user_id)
