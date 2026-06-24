from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class Source(BaseModel):
    chunk_index: int
    content: str
    start_time: float
    end_time: float


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]