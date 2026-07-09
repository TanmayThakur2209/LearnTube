import asyncio

from app.db.session import AsyncSessionLocal

from app.repositories.video_repository import VideoRepository
from app.repositories.transcript_chunk_repository import (
    TranscriptChunkRepository,
)

from app.services.transcript_service import TranscriptService
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService


class VideoProcessingService:

    @staticmethod
    async def process(video_id: str):

        async with AsyncSessionLocal() as db:

            print("Starting transcript processing...")

            video = await VideoRepository.get_by_id(
                db=db,
                video_id=video_id,
            )

            if not video:
                print("Video not found")
                return

            try:

                video.status = "PROCESSING"
                await db.commit()

                url = (
                    f"https://www.youtube.com/watch?v="
                    f"{video.youtube_video_id}"
                )

                segments = (
                    TranscriptService.get_transcript_segments(
                        url
                    )
                )

                chunks = ChunkingService.chunk_segments(
                    segments
                )

                for index, chunk in enumerate(chunks):

                    await TranscriptChunkRepository.create(
                        db=db,
                        video_id=video.id,
                        chunk_index=index,
                        content=chunk["content"],
                        start_time=chunk["start_time"],
                        end_time=chunk["end_time"],
                        embedding=None,
                    )

                await db.commit()

                saved_chunks = (
                    await TranscriptChunkRepository.get_by_video(
                        db=db,
                        video_id=video.id,
                    )
                )

                for chunk in saved_chunks:

                    chunk.embedding = (
                        EmbeddingService.get_embedding(
                            chunk.content
                        )
                    )

                video.status = "READY"

                await db.commit()

                print("Video processed!")

            except Exception as e:

                print(e)

                video.status = "FAILED"

                await db.commit()

    @staticmethod
    def process_background(video_id: str):

        asyncio.run(
            VideoProcessingService.process(video_id)
        )