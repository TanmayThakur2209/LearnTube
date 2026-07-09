from sentence_transformers import SentenceTransformer

_model = None


class EmbeddingService:

    @staticmethod
    def get_model():
        global _model

        if _model is None:
            _model = SentenceTransformer(
                "BAAI/bge-small-en-v1.5"
            )

        return _model

    @staticmethod
    def get_embedding(text: str) -> list[float]:

        model = EmbeddingService.get_model()

        return model.encode(
            text,
            normalize_embeddings=True,
            convert_to_numpy=True,
        ).tolist()