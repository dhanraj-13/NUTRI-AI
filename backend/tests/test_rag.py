from app.rag.dataset_loader import NutritionDatasetLoader
from app.rag.pipelines.rag_pipeline import get_rag_pipeline
from app.rag.retriever.retriever_utils import extract_filters


def test_dataset_loader_builds_documents():
    loader = NutritionDatasetLoader()
    documents = loader.to_documents()
    assert documents
    assert "Food Name:" in documents[0].text
    assert "food_name" in documents[0].metadata


def test_metadata_filter_extraction():
    filters = extract_filters("vegetarian high protein foods under 300 calories")
    assert filters["diet_type"] == "vegetarian"
    assert filters["min_protein"] == 8
    assert filters["max_calories"] == 300


def test_rag_pipeline_returns_response():
    pipeline = get_rag_pipeline()
    result = pipeline.answer("foods for focus", user_id="test")
    assert result["response"]
    assert isinstance(result["matches"], list)
