from sqlalchemy.ext.asyncio import AsyncSession

from app.models.video import Video
from app.repositories.video_repository import VideoRepository
from app.services.youtube_service import (
    YouTubeService,
)


class VideoService:

    @staticmethod
    async def import_video(
        db: AsyncSession,
        owner_id,
        url: str,
    ):

        metadata = YouTubeService.get_video_info(
            url
        )

        existing = await VideoRepository.get_by_owner_and_youtube_id(
            db=db,
            owner_id=owner_id,
            youtube_video_id=metadata["youtube_video_id"],
        )
        print("Existing:", existing)
        if existing:
            return existing

        video = await VideoRepository.create(
            db=db,

            owner_id=owner_id,

            youtube_video_id=metadata["youtube_video_id"],

            title=metadata["title"],

            description=metadata["description"],

            channel_name=metadata["channel_name"],

            thumbnail_url=metadata["thumbnail_url"],

            status="PENDING",
        )

        from app.tasks.video_tasks import ingest_video
        print("*"*100)
        result = ingest_video.delay(str(video.id))
        print("Task ID:", result.id)

        return video