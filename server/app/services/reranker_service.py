from sentence_transformers import CrossEncoder

_model = None


class RerankerService:

    @staticmethod

    @staticmethod
    def rerank(query, chunks, top_k=5):

        return chunks[:top_k]