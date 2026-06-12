from pathlib import Path

from app.rag.chunking.nutrition_chunker import NutritionDocument
from app.rag.embeddings.embedding_generator import EmbeddingGenerator
from app.rag.vectorstore.faiss_store import FaissStore


class VectorManager:
    def __init__(self, index_dir: str | Path):
        self.store = FaissStore(index_dir)
        self.generator = EmbeddingGenerator()

    def ensure_index(self, chunks: list[NutritionDocument]) -> FaissStore:
        if self.store.load() and self.store.documents:
            return self.store
        embeddings = self.generator.generate(chunks)
        self.store.build(chunks, embeddings)
        return self.store
