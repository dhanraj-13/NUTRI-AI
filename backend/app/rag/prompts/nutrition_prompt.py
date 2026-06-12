def build_nutrition_prompt(query: str, context: str, memory: list[str] | None = None) -> str:
    memory_text = "\n".join(memory or [])[-1200:]
    return (
        "You are an AI nutrition productivity assistant. Use only nutrition, hydration, "
        "wellness, and productivity context. Do not provide medical diagnosis.\n\n"
        f"Conversation memory:\n{memory_text}\n\n"
        f"Retrieved nutrition context:\n{context}\n\n"
        f"User query: {query}\n\n"
        "Answer with practical food suggestions and explain the nutrition reason briefly."
    )
