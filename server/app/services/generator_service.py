import requests
import json
import httpx

from app.prompts.rag_prompt import build_prompt


class GeneratorService:

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

        print("=" * 80)
        print(prompt)
        print("=" * 80)

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "qwen2.5:7b-instruct",
                "prompt": prompt,
                "stream": False,
            },
        )

        response.raise_for_status()

        data = response.json()

        return data.get("response", "")


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

        print("=" * 80)
        print(prompt)
        print("=" * 80)

        async with httpx.AsyncClient(timeout=None) as client:

            async with client.stream(
                "POST",
                "http://localhost:11434/api/generate",
                json={
                    "model": "qwen2.5:7b-instruct",
                    "prompt": prompt,
                    "stream": True,
                },
            ) as response:

                async for line in response.aiter_lines():

                    if not line:
                        continue

                    data = json.loads(line)

                    if "response" in data:
                        yield data["response"]