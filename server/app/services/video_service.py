from threading import Thread

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.video_repository import VideoRepository
from app.services.youtube_service import YouTubeService
from app.services.video_processing_service import (
    VideoProcessingService,
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

        existing = (
            await VideoRepository.get_by_owner_and_youtube_id(
                db=db,
                owner_id=owner_id,
                youtube_video_id=metadata[
                    "youtube_video_id"
                ],
            )
        )

        if existing:
            return existing

        video = await VideoRepository.create(
            db=db,
            owner_id=owner_id,
            youtube_video_id=metadata[
                "youtube_video_id"
            ],
            title=metadata["title"],
            description=metadata["description"],
            channel_name=metadata["channel_name"],
            thumbnail_url=metadata["thumbnail_url"],
            status="PENDING",
        )

        Thread(
            target=VideoProcessingService.process_background,
            args=(str(video.id),),
            daemon=True,
        ).start()

        return video