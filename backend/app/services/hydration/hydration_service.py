def calculate_hydration_score(water_amount_ml: int, goal_ml: int = 2500) -> float:
    if goal_ml <= 0:
        return 0.0
    return round(min(100.0, (water_amount_ml / goal_ml) * 100), 2)
