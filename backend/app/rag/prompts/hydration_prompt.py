def build_hydration_prompt(query: str, context: str) -> str:
    return (
        "Use the retrieved foods and hydration signals to suggest hydration-supportive "
        f"nutrition. Query: {query}\nContext:\n{context}"
    )
