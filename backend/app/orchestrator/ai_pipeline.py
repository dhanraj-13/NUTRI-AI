from app.agents.analytics_agent import AnalyticsAgent
from app.agents.nutrition_agent import NutritionAgent
from app.agents.planner_agent import PlannerAgent
from app.agents.productivity_agent import ProductivityAgent
from app.memory.interaction_memory import memory


class AIOrchestrator:
    def __init__(self):
        self.nutrition_agent = NutritionAgent()
        self.productivity_agent = ProductivityAgent()
        self.analytics_agent = AnalyticsAgent()
        self.planner_agent = PlannerAgent()

    def run(self, db, user_id: int, analytics):
        recommendation = self.nutrition_agent.generate(db, user_id, analytics)
        productivity = self.productivity_agent.score(analytics)
        insights = self.analytics_agent.insights(analytics)
        plan = self.planner_agent.plan(recommendation.summary)
        memory.add(user_id, recommendation.summary)
        return {
            "recommendation": recommendation,
            "productivity_score": productivity,
            "insights": insights,
            "plan": plan,
        }


orchestrator = AIOrchestrator()
