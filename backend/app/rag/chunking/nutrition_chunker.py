from dataclasses import dataclass


@dataclass
class NutritionDocument:
    text: str
    metadata: dict


class NutritionChunker:
    def __init__(self, chunk_size: int = 900, chunk_overlap: int = 120):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk(self, documents: list[NutritionDocument]) -> list[NutritionDocument]:
        chunks: list[NutritionDocument] = []
        for doc in documents:
            text = doc.text
            if len(text) <= self.chunk_size:
                chunks.append(doc)
                continue

            start = 0
            while start < len(text):
                end = start + self.chunk_size
                chunk_text = text[start:end]
                chunks.append(NutritionDocument(text=chunk_text, metadata=dict(doc.metadata)))
                start = max(end - self.chunk_overlap, end)
        return chunks
