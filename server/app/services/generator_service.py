from google import genai

from app.core.config import settings
from app.prompts.rag_prompt import build_prompt


_client = None


class GeneratorService:

    @staticmethod
    def get_client():
        global _client

        if _client is None:
            _client = genai.Client(
                api_key=settings.GOOGLE_API_KEY,
            )

        return _client

    @staticmethod
    def generate(
        context: str,
        question: str,
        history: str,
    ) -> str:

        prompt = build_prompt(
            context=context,
            question=question,
            history=history,
        )

        client = GeneratorService.get_client()

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return response.text or ""

    @staticmethod
    async def stream_generate(
        context: str,
        question: str,
        history: str,
    ):

        prompt = build_prompt(
            context=context,
            question=question,
            history=history,
        )

        client = GeneratorService.get_client()

        stream = client.models.generate_content_stream(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        print(prompt)

        for chunk in stream:
            if chunk.text:
                yield chunk.text