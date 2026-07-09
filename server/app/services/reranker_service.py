from sentence_transformers import CrossEncoder

_model = None


class RerankerService:

    @staticmethod
    def get_model():
        global _model

        if _model is None:
            _model = CrossEncoder(
                "cross-encoder/ms-marco-MiniLM-L-6-v2"
            )

        return _model

    @staticmethod
    def rerank(query, chunks, top_k=5):

        if not chunks:
            return []

        model = RerankerService.get_model()

        pairs = [
            (query, chunk.content)
            for chunk in chunks
        ]

        scores = model.predict(
            pairs,
            show_progress_bar=False,
        )

        ranked = sorted(
            zip(chunks, scores),
            key=lambda x: x[1],
            reverse=True,
        )

        return [
            chunk
            for chunk, _ in ranked[:top_k]
        ]