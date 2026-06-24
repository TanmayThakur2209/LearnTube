from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepository:
    @staticmethod
    async def get_by_email(
        db: AsyncSession,
        email: str,
    ) -> User | None:
        result = await db.execute(
            select(User).where(User.email == email)
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def create(
        db: AsyncSession,
        user: User,
    ) -> User:
        db.add(user)

        try:
            await db.commit()
        except Exception:
            await db.rollback()
            raise

        await db.refresh(user)

        return user