from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.video import Video


class VideoRepository:

    @staticmethod
    async def create(
        db: AsyncSession,
        **kwargs,
    ) -> Video:
        video = Video(**kwargs)

        db.add(video)

        await db.commit()
        await db.refresh(video)

        return video
    
    @staticmethod
    async def get_by_owner(
        db: AsyncSession,
        owner_id,
    ) -> list[Video]:
        result = await db.execute(
            select(Video)
            .where(Video.owner_id == owner_id)
            .order_by(Video.created_at.desc())
        )

        return result.scalars().all()

    @staticmethod
    async def get_by_owner_and_youtube_id(
        db: AsyncSession,
        owner_id,
        youtube_video_id: str,
    ) -> Video | None:
        result = await db.execute(
            select(Video).where(
                Video.owner_id == owner_id,
                Video.youtube_video_id == youtube_video_id,
            )
        )

        return result.scalar_one_or_none()
    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        video_id,
    ):
        result = await db.execute(
            select(Video).where(
                Video.id == video_id
            )
        )

        return result.scalar_one_or_none()
    
    @staticmethod
    async def count_by_owner(
        db,
        owner_id,
    ):
        result = await db.execute(
            select(func.count(Video.id))
            .where(Video.owner_id == owner_id)
        )

        return result.scalar()
