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
            "cookiefile": get_cookie_file(),
            "outtmpl": output,
            "quiet": True,
        }

        with yt_dlp.YoutubeDL(opts) as ydl:

            info = ydl.extract_info(
                video_url,
                download=True,
            )

        video_id = info["id"]

        path = f"/tmp/{video_id}.en.vtt"

        if not os.path.exists(path):
            raise Exception("Subtitle not found")

        return path
    
