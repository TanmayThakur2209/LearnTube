class ChunkingService:

    @staticmethod
    def chunk_text(
        text: str,
        chunk_size: int = 800,
        overlap: int = 100,
    ):
        chunks = []

        step = chunk_size - overlap

        for i in range(
            0,
            len(text),
            step,
        ):
            chunks.append(
                text[i:i + chunk_size]
            )

        return chunks

    @staticmethod
    def chunk_segments(
        segments,
        chunk_size: int = 1000,
        ):
        chunks = []

        current_text = []
        current_length = 0

        start_time = None
        end_time = None

        for segment in segments:

            text = segment["text"]

            if start_time is None:
                start_time = segment["start"]

            end_time = segment["end"]
            current_text.append(text)
            current_length += len(text)

            if current_length >= chunk_size:

                chunks.append(
                    {
                        "content": " ".join(current_text),
                        "start_time": start_time,
                        "end_time": end_time,
                    }
                )

                current_text = []
                current_length = 0
                start_time = None
                end_time = None

        if current_text:

            chunks.append(
                {
                    "content": " ".join(current_text),
                    "start_time": start_time,
                    "end_time": end_time,
                }
            )

        return chunks