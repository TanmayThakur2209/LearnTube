from sentence_transformers import CrossEncoder




class RerankerService:

    @staticmethod
    def rerank(
        query: str,
        chunks,
        top_k: int = 5,
    ):

        if not chunks:
            return []

        pairs = [
            (
                query,
                chunk.content,
            )
            for chunk in chunks
        ]

        model = CrossEncoder("BAAI/bge-reranker-base")
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
            for chunk, _
            in ranked[:top_k]
        ]