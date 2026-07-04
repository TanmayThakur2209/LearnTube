import os
import webvtt

from app.services.downloader_service import DownloaderService


class TranscriptService:

    @staticmethod
    def get_transcript_segments(video_url):

        subtitle = DownloaderService.download_subtitles(
            video_url
        )

        segments = []
        previous = ""

        for caption in webvtt.read(subtitle):
            start = TranscriptService.to_seconds(caption.start)
            end = TranscriptService.to_seconds(caption.end)


            normalized = "\n".join(
                dict.fromkeys(caption.text.splitlines())
            ).strip()

            normalized = " ".join(normalized.split())

            text = normalized

            if previous and text.startswith(previous):
                text = text[len(previous):].strip()

            previous = normalized

            if not text:
                continue
        

            segments.append(
                {
                    "text": text,
                    "start": start,
                    "end": end,
                }
            )
            

        os.remove(subtitle)

        return segments

    @staticmethod
    def to_seconds(timestamp):

        h, m, s = timestamp.split(":")

        return (
            int(h) * 3600
            + int(m) * 60
            + float(s)
        )