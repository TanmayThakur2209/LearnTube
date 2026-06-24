import asyncio
from uuid import UUID
from app.repositories.transcript_chunk_repository import TranscriptChunkRepository
from app.services.embedding_service import EmbeddingService
from app.services.reranker_service import RerankerService

class RetrievalService:

    @staticmethod
    async def retrieve(
        db,
        video_id: UUID,
        query: str,
        limit: int = 5,
    ):

        embedding = EmbeddingService.get_embedding(
            query
        )

        semantic_chunks = (
            await TranscriptChunkRepository.semantic_search(
                db=db,
                video_id=video_id,
                embedding=embedding,
                limit=20,
            )
        )

        keyword_chunks = (
            await TranscriptChunkRepository.keyword_search(
                db=db,
                video_id=video_id,
                query=query,
                limit=20,
            )
        )

        merged = {}

        for chunk in semantic_chunks:
            merged[chunk.id] = chunk

        for chunk in keyword_chunks:
            merged[chunk.id] = chunk

        candidates = list(
            merged.values()
        )

        reranked = await asyncio.to_thread(
            RerankerService.rerank,
            query=query,
            chunks=candidates,
            top_k=limit,
        )

        return reranked

    @staticmethod
    async def retrieve_context(
        db,
        video_id: UUID,
        query: str,
        limit: int = 5,
    ) -> str:

        chunks = await RetrievalService.retrieve(
            db=db,
            video_id=video_id,
            query=query,
            limit=limit,
        )

        return "\n\n".join(
            chunk.content
            for chunk in chunks
        )