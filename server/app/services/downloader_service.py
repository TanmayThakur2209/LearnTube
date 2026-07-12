import os
import yt_dlp

from app.core.cookies import get_cookie_file


class DownloaderService:

    DOWNLOAD_DIR = "/tmp"

    @staticmethod
    def download_subtitles(video_url):

        output = os.path.join(
            DownloaderService.DOWNLOAD_DIR,
            "%(id)s.%(ext)s",
        )

        opts = {
            "skip_download": True,
            "writesubtitles": True,
            "writeautomaticsub": True,
            "subtitleslangs": ["en"],
            "subtitlesformat": "vtt",

            "format": "none",     
            "simulate": True,    

            "cookiefile": get_cookie_file(),
            "outtmpl": output,
            "quiet": True,
            "no_warnings": True,
            "extractor_args": {
                "youtube": {
                    "player_client": ["ios", "android", "web_safari"],
                }
            },
        }

        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(
                video_url,
                download=True,
            )

        video_id = info["id"]

        candidates = [
            f"/tmp/{video_id}.en.vtt",
            f"/tmp/{video_id}.en-US.vtt",
            f"/tmp/{video_id}.en-GB.vtt",
        ]

        for path in candidates:
            if os.path.exists(path):
                return path

        raise Exception("English subtitle not found.")