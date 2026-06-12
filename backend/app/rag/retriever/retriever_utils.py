def extract_filters(query: str) -> dict:
    normalized = query.lower()
    filters: dict = {}
    if "vegetarian" in normalized:
        filters["diet_type"] = "vegetarian"
    if "under 300" in normalized or "below 300" in normalized:
        filters["max_calories"] = 300
    if "high protein" in normalized or "protein" in normalized:
        filters["min_protein"] = 8
    if "hydration" in normalized or "water" in normalized:
        filters["hydration"] = True
    return filters
