from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.db.mixins import TimestampMixin, UUIDMixin

class Video(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "videos"

    __table_args__ = (
        UniqueConstraint(
            "owner_id",
            "youtube_video_id",
            name="uq_owner_video",
        ),
    )

    owner_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    youtube_video_id: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
    )

    channel_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    thumbnail_url: Mapped[str | None] = mapped_column(
        String(1024),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(32),
        default="PENDING",
        nullable=False,
    )

    owner = relationship(
        "User",
        back_populates="videos",
    )

    description: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )