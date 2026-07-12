import asyncio

from app.db.session import AsyncSessionLocal

from app.repositories.video_repository import VideoRepository
from app.repositories.transcript_repository import TranscriptRepository
from app.services.transcript_service import TranscriptService   

from app.celery.celery_app import celery_app
from app.services.chunking_service import ChunkingService
from app.repositories.transcript_chunk_repository import TranscriptChunkRepository


@celery_app.task(name="app.tasks.video_tasks.ingest_video")
def ingest_video(video_id: str):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        loop.run_until_complete(process(video_id))
    finally:
        loop.close()
        
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
        url = f"https://www.youtube.com/watch?v={video.youtube_video_id}"
        segments = TranscriptService.get_transcript_segments(url)

        chunks = ChunkingService.chunk_segments(segments)
        print("Chunking transcript...")

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

        print(f"Saved {len(chunks)} chunks")
        print("Transcript saved!")

        from app.services.embedding_service import EmbeddingService

        saved_chunks = await TranscriptChunkRepository.get_by_video(
            db=db,
            video_id=video.id,
        )

        texts = [
            chunk.content
            for chunk in saved_chunks
        ]

        try:
            embeddings = EmbeddingService.get_embeddings(texts)

            for chunk, embedding in zip(saved_chunks, embeddings):
                chunk.embedding = embedding

            await db.commit()

        except Exception as e:
            print(e)

        print("Embeddings generated!")  