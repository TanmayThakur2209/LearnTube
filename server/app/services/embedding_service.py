from google import genai

from app.core.config import settings


_client = genai.Client(api_key=settings.GOOGLE_API_KEY)


class EmbeddingService:
    MODEL = "gemini-embedding-001"

    @staticmethod
    def get_embedding(text: str) -> list[float]:

        response = _client.models.embed_content(
            model=EmbeddingService.MODEL,
            contents=text,
            config={
                "output_dimensionality": 768
            },
        )

        return response.embeddings[0].values