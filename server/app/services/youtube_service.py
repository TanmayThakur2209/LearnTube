from urllib.parse import parse_qs, urlparse

from googleapiclient.discovery import build

from app.core.config import settings


class YouTubeService:
    @staticmethod
    def extract_video_id(url: str) -> str:
        parsed = urlparse(url)

        if parsed.hostname in (
            "www.youtube.com",
            "youtube.com",
        ):
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
        )

        response = youtube.videos().list(
            part="snippet",
            id=video_id,
        ).execute()

        items = response.get("items", [])

        if not items:
            raise ValueError("Video not found")

        snippet = items[0]["snippet"]

        thumbnails = snippet.get("thumbnails", {})

        thumbnail_url = None
        if "high" in thumbnails:
            thumbnail_url = thumbnails["high"]["url"]
        elif "medium" in thumbnails:
            thumbnail_url = thumbnails["medium"]["url"]
        elif "default" in thumbnails:
            thumbnail_url = thumbnails["default"]["url"]

        return {
            "youtube_video_id": video_id,
            "title": snippet["title"],
            "description": snippet.get("description"),
            "channel_name": snippet["channelTitle"],
            "thumbnail_url": thumbnail_url,
        }