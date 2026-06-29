import os
import yt_dlp


class DownloaderService:

    DOWNLOAD_DIR = "/tmp"

    @staticmethod
    def download(video_url: str):

        output = os.path.join(
            DownloaderService.DOWNLOAD_DIR,
            "%(id)s.%(ext)s",
        )

        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": output,
            "writesubtitles": True,
            "writeautomaticsub": True,
            "subtitleslangs": ["en"],
            "skip_download": False,
            "quiet": True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)

        video_id = info["id"]

        audio = None

        for ext in ["m4a", "mp3", "webm"]:
            path = f"/tmp/{video_id}.{ext}"
            if os.path.exists(path):
                audio = path
                break

        subtitle = None

        for ext in ["en.vtt", "en.srt"]:
            path = f"/tmp/{video_id}.{ext}"
            if os.path.exists(path):
                subtitle = path
                break
        print(info)
        print("Audio:", audio)  
        print("Subtitle:", subtitle)
        return audio, subtitle