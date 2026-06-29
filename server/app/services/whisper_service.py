import whisper


class WhisperService:

    model = whisper.load_model("base")


    @classmethod
    def transcribe(cls, audio_path):

        result = cls.model.transcribe(
            audio_path,
            fp16=False,
        )

        segments = []

        for s in result["segments"]:

            segments.append(
                {
                    "text": s["text"],
                    "start": s["start"],
                    "end": s["end"],
                }
            )

        return segments