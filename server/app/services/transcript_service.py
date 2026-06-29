import os

from app.services.downloader_service import DownloaderService
from app.services.whisper_service import WhisperService


class TranscriptService:

    @staticmethod
    def get_transcript_segments(video_url):

        audio, subtitle = DownloaderService.download(video_url)

        segments = WhisperService.transcribe(audio)

        if audio and os.path.exists(audio):
            os.remove(audio)

        if subtitle and os.path.exists(subtitle):
            os.remove(subtitle)

        return segments