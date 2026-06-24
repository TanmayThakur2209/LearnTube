from sqlalchemy import select

from app.models.chat_session import ChatSession


class ChatSessionRepository:

    @staticmethod
    async def get_or_create(
        db,
        video_id,
        user_id,
    ):
        result = await db.execute(
            select(ChatSession).where(
                ChatSession.video_id == video_id,
                ChatSession.user_id == user_id,
            )
        )

        session = result.scalar_one_or_none()

        if session:
            return session

        session = ChatSession(
            video_id=video_id,
            user_id=user_id,
            title="New Chat",
        )

        db.add(session)
        await db.flush()

        return session