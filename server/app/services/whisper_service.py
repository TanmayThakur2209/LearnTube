import whisper


class WhisperService:

    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            cls._model = whisper.load_model("tiny")
        return cls._model

    @classmethod
    def transcribe(cls, audio_path):

        model = cls.get_model()

        result = model.transcribe(
            audio_path,
            fp16=False,
        )

        return [
            {
                "text": s["text"],
                "start": s["start"],
                "end": s["end"],
            }
            for s in result["segments"]
        ]