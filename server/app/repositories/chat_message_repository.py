from sqlalchemy import select

from app.models.chat_message import ChatMessage


class ChatMessageRepository:

    @staticmethod
    async def create(
        db,
        session_id,
        role,
        content,
    ):
        message = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
        )

        db.add(message)

        return message

    @staticmethod
    async def get_history(
        db,
        session_id,
        limit: int = 20,
    ):
        result = await db.execute(
            select(ChatMessage)
            .where(
                ChatMessage.session_id == session_id,
            )
            .order_by(
                ChatMessage.created_at.asc()
            )
        )

        messages = result.scalars().all()
        return messages[-limit:]