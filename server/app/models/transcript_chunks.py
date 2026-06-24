from uuid import UUID

from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector
from sqlalchemy import Float

from app.db.base import Base
from app.db.mixins import UUIDMixin, TimestampMixin
from sqlalchemy import Float
from sqlalchemy.dialects.postgresql import TSVECTOR


class TranscriptChunk(
    Base,
    UUIDMixin,
    TimestampMixin,
):
    __tablename__ = "transcript_chunks"

    video_id: Mapped[UUID] = mapped_column(
        ForeignKey(
            "videos.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    chunk_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    search_vector: Mapped[str | None] = mapped_column(
        TSVECTOR,
        nullable=True,
    )
    
    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(384),
        nullable=True,
    )

    start_time: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    end_time: Mapped[float] = mapped_column(
        Float,  
        nullable=False,
    ) 
