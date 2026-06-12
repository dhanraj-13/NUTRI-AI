from app.rag.embeddings.embedding_model import EmbeddingModel
from app.rag.vectorstore.faiss_store import FaissStore


class NutritionRetriever:
    def __init__(self, store: FaissStore, embedding_model: EmbeddingModel | None = None):
        self.store = store
        self.embedding_model = embedding_model or EmbeddingModel()

    def search(self, query: str, top_k: int = 5, filters: dict | None = None) -> list[dict]:
        if not query.strip():
            return []
        query_embedding = self.embedding_model.encode([query])[0]
        return self.store.search(query_embedding=query_embedding, top_k=top_k, filters=filters)
