from app.rag.retriever.nutrition_retriever import NutritionRetriever


def semantic_search(retriever: NutritionRetriever, query: str, top_k: int = 5) -> list[dict]:
    return retriever.search(query=query, top_k=top_k)
