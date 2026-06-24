from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transcript import Transcript

from sqlalchemy import select

from app.models.transcript_chunks import TranscriptChunk

class TranscriptRepository:

    @staticmethod
    async def create(
        db: AsyncSession,
        **kwargs,
    ) -> Transcript:

        transcript = Transcript(**kwargs)

        db.add(transcript)

        await db.commit()
        await db.refresh(transcript)

        return transcript
    

    @staticmethod
    async def get_by_video(
        db,
        video_id,
    ):
        result = await db.execute(
            select(TranscriptChunk).where(
                TranscriptChunk.video_id == video_id
            ).order_by(
                TranscriptChunk.chunk_index
            )
        )

        return result.scalars().all()