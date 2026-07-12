from urllib.parse import urlparse, parse_qs

from googleapiclient.discovery import build

from app.core.config import settings


class YouTubeService:

    @staticmethod
    def extract_video_id(url: str) -> str:
        parsed = urlparse(url)

        if parsed.hostname in ("youtube.com", "www.youtube.com"):
            return parse_qs(parsed.query)["v"][0]

        if parsed.hostname == "youtu.be":
            return parsed.path.lstrip("/")

        raise ValueError("Invalid YouTube URL")

    @staticmethod
    def get_video_info(url: str):

        video_id = YouTubeService.extract_video_id(url)

        youtube = build(
            "youtube",
            "v3",
            developerKey=settings.YOUTUBE_API_KEY,
        )

        response = (
            youtube.videos()
            .list(
                part="snippet",
                id=video_id,
            )
            .execute()
        )

        if not response["items"]:
            raise Exception("Video not found")

        snippet = response["items"][0]["snippet"]

        return {
            "youtube_video_id": video_id,
            "title": snippet["title"],
            "description": snippet["description"],
            "channel_name": snippet["channelTitle"],
            "thumbnail_url": snippet["thumbnails"]["high"]["url"],
        }