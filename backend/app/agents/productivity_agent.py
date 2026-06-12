class ProductivityAgent:
    def score(self, analytics) -> float:
        return max(0.0, min(100.0, analytics.productivity_score))
