from pathlib import Path
from threading import Lock

from app.core.config import settings
from app.rag.chunking.nutrition_chunker import NutritionChunker
from app.rag.dataset_loader import NutritionDatasetLoader
from app.rag.memory.conversation_memory import conversation_memory
from app.rag.prompts.nutrition_prompt import build_nutrition_prompt
from app.rag.retriever.nutrition_retriever import NutritionRetriever
from app.rag.retriever.retriever_utils import extract_filters
from app.rag.vectorstore.vector_manager import VectorManager


class RAGPipeline:
    def __init__(self):
        self.index_dir = Path(__file__).resolve().parents[1] / "data" / "vector_index"
        self.loader = NutritionDatasetLoader()
        self.chunker = NutritionChunker()
        self.vector_manager = VectorManager(self.index_dir)
        self.retriever: NutritionRetriever | None = None
        self._lock = Lock()
        self._initialized = False

    def initialize(self) -> None:
        with self._lock:
            if self._initialized:
                return
            documents = self.loader.to_documents()
            chunks = self.chunker.chunk(documents)
            store = self.vector_manager.ensure_index(chunks)
            self.retriever = NutritionRetriever(store)
            self._initialized = True

    def answer(self, query: str, user_id: str = "anonymous", top_k: int = 5) -> dict:
        self.initialize()
        if self.retriever is None:
            return self._empty_response(query)

        filters = extract_filters(query)
        matches = self.retriever.search(query=query, top_k=top_k, filters=filters)
        context = "\n\n".join(match["text"] for match in matches)
        memory = conversation_memory.get(user_id)
        prompt = build_nutrition_prompt(query=query, context=context, memory=memory)
        response = self._generate_response(query=query, matches=matches, prompt=prompt)

        conversation_memory.add(user_id, "user", query)
        conversation_memory.add(user_id, "assistant", response)
        return {
            "response": response,
            "matches": matches,
            "filters": filters,
            "model": "openai" if settings.__dict__.get("openai_api_key") else "local-rag",
        }

    def _generate_response(self, query: str, matches: list[dict], prompt: str) -> str:
        api_key = getattr(settings, "openai_api_key", "")
        if api_key:
            try:
                from openai import OpenAI

                client = OpenAI(api_key=api_key)
                completion = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.4,
                )
                return completion.choices[0].message.content or ""
            except Exception:
                pass

        if not matches:
            return "I could not find a close nutrition match yet. Try asking for focus foods, high protein breakfast, hydration foods, or foods under 300 calories."
        names = [match["metadata"].get("food_name", "food") for match in matches[:4]]
        benefits = [match["metadata"].get("health_benefits", "") for match in matches[:3]]
        return (
            f"For '{query}', good matches are {', '.join(names)}. "
            f"They fit the nutrition context because: {'; '.join(filter(None, benefits))}. "
            "Pair protein, fiber, and hydration-supportive foods for steadier energy and focus."
        )

    def _empty_response(self, query: str) -> dict:
        return {"response": f"No nutrition context is available for: {query}", "matches": [], "filters": {}}


_pipeline: RAGPipeline | None = None


def get_rag_pipeline() -> RAGPipeline:
    global _pipeline
    if _pipeline is None:
        _pipeline = RAGPipeline()
    return _pipeline
