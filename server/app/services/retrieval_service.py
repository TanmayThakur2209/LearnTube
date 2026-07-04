from uuid import UUID
import asyncio
from app.repositories.transcript_chunk_repository import TranscriptChunkRepository
from app.services.embedding_service import EmbeddingService
from app.services.reranker_service import RerankerService


class RetrievalService:

    @staticmethod
    async def retrieve(
        db,
        video_id: UUID,
        query: str,
        candidate_limit: int = 20,
        final_limit: int = 5,
    ):

        embedding = EmbeddingService.get_embedding(query)

        semantic_chunks = await TranscriptChunkRepository.semantic_search(
            db=db,
            video_id=video_id,
            embedding=embedding,
            limit=candidate_limit,
        )

        keyword_chunks = await TranscriptChunkRepository.keyword_search(
            db=db,
            video_id=video_id,
            query=query,
            limit=candidate_limit,
        )

        merged = {}

        for chunk in semantic_chunks:
            merged[chunk.id] = chunk

        for chunk in keyword_chunks:
            merged[chunk.id] = chunk

        candidates = list(merged.values())

        reranked = await asyncio.to_thread(
            RerankerService.rerank,
            query=query,
            chunks=candidates,
            top_k=final_limit,
        )

        return reranked

    @staticmethod
    def build_context(chunks):

        context = []

        for chunk in chunks:

            start = f"{int(chunk.start_time//60):02d}:{int(chunk.start_time%60):02d}"
            end = f"{int(chunk.end_time//60):02d}:{int(chunk.end_time%60):02d}"

            context.append(
                f"""[{start} - {end}]
                {chunk.content}
                """
                )

        return "\n\n".join(context)