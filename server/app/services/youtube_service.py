from urllib.parse import parse_qs, urlparse
from app.core.cookies import get_cookie_file
import yt_dlp


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
        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "skip_download": True,
            "cookiefile": get_cookie_file(),
            "extractor_args": {
                "youtube": {
                    "player_client": ["ios", "android", "web_safari"],
                }
                },
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        return {
            "youtube_video_id": info["id"],
            "title": info.get("title"),
            "description": info.get("description"),
            "channel_name": info.get("uploader"),
            "thumbnail_url": info.get("thumbnail"),
        }