class AnalyticsAgent:
    def insights(self, analytics) -> dict:
        return {
            "nutrition_score": analytics.nutrition_score,
            "productivity_score": analytics.productivity_score,
            "hydration_total": analytics.hydration_total,
        }
