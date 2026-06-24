from pydantic import BaseModel, HttpUrl
from uuid import UUID


class VideoImportRequest(BaseModel):
    url: HttpUrl


class VideoResponse(BaseModel):
    id: UUID
    youtube_video_id: str
    title: str
    description: str | None
    channel_name: str
    thumbnail_url: str
    status: str

    model_config = {
        "from_attributes": True,
    }