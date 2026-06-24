from youtube_transcript_api import YouTubeTranscriptApi


class TranscriptService:

    @staticmethod
    def get_transcript(video_id: str) -> str:
        api = YouTubeTranscriptApi()

        transcript = api.fetch(video_id)

        return " ".join(
            snippet.text
            for snippet in transcript
        )
    
    @staticmethod
    def get_transcript_segments(video_id: str):
        api = YouTubeTranscriptApi()

        transcript = api.fetch(video_id)

        return transcript