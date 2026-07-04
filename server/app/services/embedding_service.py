from sentence_transformers import SentenceTransformer

class EmbeddingService:

    @staticmethod
    def get_embedding(text: str) -> list[float]:
        model = SentenceTransformer("BAAI/bge-small-en-v1.5")
        return model.encode(
            text,
            normalize_embeddings=True,
            convert_to_numpy=True,
        ).tolist()