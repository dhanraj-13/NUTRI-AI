from app.rag.chunking.nutrition_chunker import NutritionDocument
from app.rag.embeddings.embedding_model import EmbeddingModel


class EmbeddingGenerator:
    def __init__(self, model: EmbeddingModel | None = None):
        self.model = model or EmbeddingModel()

    def generate(self, chunks: list[NutritionDocument]) -> list[list[float]]:
        return self.model.encode([chunk.text for chunk in chunks])
