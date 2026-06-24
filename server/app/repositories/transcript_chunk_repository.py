from sqlalchemy import select, func
from app.models.transcript_chunks import TranscriptChunk
from sqlalchemy import select, func

class TranscriptChunkRepository:

    @staticmethod
    async def create(
        db,
        video_id,
        chunk_index,
        content,
        start_time,
        end_time,
        embedding=None,
    ):
        chunk = TranscriptChunk(
            video_id=video_id,
            chunk_index=chunk_index,
            content=content,
            embedding=embedding,
            start_time=start_time,
            end_time=end_time,
        )

        db.add(chunk)

        return chunk

    @staticmethod
    async def get_by_video(
        db,
        video_id,
    ):
        result = await db.execute(
            select(TranscriptChunk)
            .where(
                TranscriptChunk.video_id == video_id
            )
            .order_by(
                TranscriptChunk.chunk_index
            )
        )

        return result.scalars().all()
    
    @staticmethod
    async def semantic_search(
        db,
        video_id,
        embedding,
        limit: int = 10,
    ):
        result = await db.execute(
            select(TranscriptChunk)
            .where(
                TranscriptChunk.video_id == video_id
            )
            .order_by(
                TranscriptChunk.embedding.cosine_distance(
                    embedding
                )
            )
            .limit(limit)
        )

        return result.scalars().all()
    
    @staticmethod
    async def keyword_search(
        db,
        video_id,
        query: str,
        limit: int = 10,
    ):
        ts_query = func.plainto_tsquery(
            "english",
            query,
        )

        result = await db.execute(
            select(TranscriptChunk)
            .where(
                TranscriptChunk.video_id == video_id
            )
            .where(
                TranscriptChunk.search_vector.op("@@")(ts_query)
            )
            .order_by(
                func.ts_rank(
                    TranscriptChunk.search_vector,
                    ts_query,
                ).desc()
            )
            .limit(limit)
        )

        return result.scalars().all()