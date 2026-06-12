def build_productivity_prompt(query: str, context: str) -> str:
    return (
        "Recommend foods that support steady energy and focus using the nutrition context. "
        f"Query: {query}\nContext:\n{context}"
    )
