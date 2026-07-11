from urllib.parse import parse_qs, urlparse

from googleapiclient.discovery import build

from app.core.config import settings


class YouTubeService:

    @staticmethod
    def extract_video_id(url: str) -> str:
        parsed = urlparse(url)

        if parsed.hostname in ("www.youtube.com", "youtube.com"):
            return parse_qs(parsed.query)["v"][0]

        if parsed.hostname == "youtu.be":
            return parsed.path.lstrip("/")

        raise ValueError("Invalid YouTube URL")

    @staticmethod
    def get_video_info(url: str) -> dict:

        video_id = YouTubeService.extract_video_id(url)

        youtube = build(
            "youtube",
            "v3",
            developerKey=settings.YOUTUBE_API_KEY,
            cache_discovery=False,
        )

        response = (
            youtube.videos()
            .list(
                part="snippet",
                id=video_id,
            )
            .execute()
        )

        items = response.get("items", [])

        if not items:
            raise Exception("Video not found")

        snippet = items[0]["snippet"]

        thumbnails = snippet.get("thumbnails", {})

        thumbnail = (
            thumbnails.get("maxres")
            or thumbnails.get("standard")
            or thumbnails.get("high")
            or thumbnails.get("medium")
            or thumbnails.get("default")
        )

        return {
            "youtube_video_id": video_id,
            "title": snippet.get("title"),
            "description": snippet.get("description"),
            "channel_name": snippet.get("channelTitle"),
            "thumbnail_url": thumbnail["url"] if thumbnail else None,
        }