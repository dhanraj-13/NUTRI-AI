import json
from pathlib import Path

from app.rag.chunking.nutrition_chunker import NutritionDocument
from app.rag.embeddings.embedding_utils import cosine_similarity


class FaissStore:
    def __init__(self, index_dir: str | Path):
        self.index_dir = Path(index_dir)
        self.index_dir.mkdir(parents=True, exist_ok=True)
        self.documents: list[NutritionDocument] = []
        self.embeddings: list[list[float]] = []

    def build(self, documents: list[NutritionDocument], embeddings: list[list[float]]) -> None:
        self.documents = documents
        self.embeddings = embeddings
        self.persist()

    def persist(self) -> None:
        payload = [
            {"text": doc.text, "metadata": doc.metadata, "embedding": embedding}
            for doc, embedding in zip(self.documents, self.embeddings)
        ]
        (self.index_dir / "nutrition_vectors.json").write_text(json.dumps(payload), encoding="utf-8")

    def load(self) -> bool:
        path = self.index_dir / "nutrition_vectors.json"
        if not path.exists():
            return False
        payload = json.loads(path.read_text(encoding="utf-8"))
        self.documents = [NutritionDocument(text=item["text"], metadata=item["metadata"]) for item in payload]
        self.embeddings = [item["embedding"] for item in payload]
        return True

    def search(self, query_embedding: list[float], top_k: int = 5, filters: dict | None = None) -> list[dict]:
        filters = filters or {}
        scored: list[dict] = []
        for doc, embedding in zip(self.documents, self.embeddings):
            if not self._passes_filters(doc.metadata, filters):
                continue
            scored.append(
                {
                    "score": cosine_similarity(query_embedding, embedding),
                    "text": doc.text,
                    "metadata": doc.metadata,
                }
            )
        return sorted(scored, key=lambda item: item["score"], reverse=True)[:top_k]

    def _passes_filters(self, metadata: dict, filters: dict) -> bool:
        diet_type = filters.get("diet_type")
        if diet_type and diet_type.lower() not in str(metadata.get("diet_type", "")).lower():
            return False
        max_calories = filters.get("max_calories")
        if max_calories is not None and float(metadata.get("calories", 0) or 0) > float(max_calories):
            return False
        min_protein = filters.get("min_protein")
        if min_protein is not None and float(metadata.get("protein", 0) or 0) < float(min_protein):
            return False
        hydration = filters.get("hydration")
        if hydration and float(metadata.get("hydration_score", 0) or 0) < 7:
            return False
        return True
