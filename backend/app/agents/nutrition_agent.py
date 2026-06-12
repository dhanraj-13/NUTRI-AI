from app.models.entities import AIRecommendation, NutritionFood


class NutritionAgent:
    def generate(self, db, user_id: int, analytics) -> AIRecommendation:
        rec_type = "balanced"
        if analytics.hydration_total < 2000:
            rec_type = "hydration"
        elif analytics.protein_total < 70:
            rec_type = "protein"

        foods = db.query(NutritionFood).order_by(NutritionFood.hydration_score.desc(), NutritionFood.protein.desc()).limit(5).all()
        food_names = ", ".join(f.food_name for f in foods)
        summary = f"Focus: {rec_type}. Suggested foods: {food_names}."

        rec = AIRecommendation(user_id=user_id, recommendation_type=rec_type, summary=summary)
        db.add(rec)
        db.commit()
        db.refresh(rec)
        return rec
