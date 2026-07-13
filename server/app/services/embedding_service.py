from google import genai
from app.core.config import settings

_client = genai.Client(api_key=settings.GOOGLE_API_KEY)


class EmbeddingService:
    MODEL = "gemini-embedding-001"

    @staticmethod
    def get_embedding(text: str) -> list[float]:
        return EmbeddingService.get_embeddings([text])[0]

    @staticmethod
    def get_embeddings(texts: list[str]) -> list[list[float]]:
        response = _client.models.embed_content(
            model=EmbeddingService.MODEL,
            contents=texts,
            config={
                "output_dimensionality": 768,
            },
        )

        return [
            embedding.values
            for embedding in response.embeddings
        ]