from pathlib import Path

from app.rag.vectorstore.faiss_store import FaissStore


def load_vector_store(index_dir: str | Path) -> FaissStore:
    store = FaissStore(index_dir)
    store.load()
    return store
