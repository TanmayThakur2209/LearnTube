from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.dependencies.auth import (get_current_user)
from app.models.user import User
from app.schemas.video import (VideoImportRequest,VideoResponse,)
from app.services.video_service import (VideoService)

from uuid import UUID
from app.services.retrieval_service import RetrievalService
from app.services.generator_service import GeneratorService
from app.repositories.video_repository import VideoRepository
from app.schemas.chat import (ChatRequest,ChatResponse,Source)
from app.repositories.chat_message_repository import ChatMessageRepository
from app.repositories.chat_session_repository import ChatSessionRepository

router = APIRouter(
    prefix="/videos",
    tags=["Videos"],
)


@router.post(
    "/import",
    response_model=VideoResponse,
)
async def import_video(
    payload: VideoImportRequest,
    db: AsyncSession = Depends(
        get_db
    ),
    current_user: User = Depends(
        get_current_user
    ),
):

    video = await VideoService.import_video(

        db=db,

        owner_id=current_user.id,

        url=str(payload.url),
    )

    return video    

@router.get(
    "",
    response_model=list[VideoResponse],
)
async def get_videos(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    videos = await VideoRepository.get_by_owner(
        db=db,
        owner_id=current_user.id,
    )

    return videos

@router.get(
    "/{video_id}",
    response_model=VideoResponse,
)
async def get_video(
    video_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    video = await VideoRepository.get_by_id(
        db=db,
        video_id=video_id,
    )

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found",
        )

    if video.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized",
        )

    return video

@router.get("/{video_id}/search")
async def search_video(
    video_id: UUID,
    query: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    video = await VideoRepository.get_by_id(
        db=db,
        video_id=video_id,
    )

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found",
        )

    if video.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized",
        )
    
    chunks = await RetrievalService.retrieve(
        db=db,
        video_id=video_id,
        query=query,
        limit=5,
    )

    return [
        {
            "chunk_index": chunk.chunk_index,
            "content": chunk.content,
        }
        for chunk in chunks
    ]

@router.post(
    "/{video_id}/chat",
    response_model=ChatResponse,
)
async def chat_with_video(
    video_id: UUID,
    payload: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    
    video = await VideoRepository.get_by_id(
        db=db,
        video_id=video_id,
    )

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found",
        )

    if video.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized",
        )

    chunks = await RetrievalService.retrieve(
        db=db,
        video_id=video_id,
        query=payload.question,
    )

    context = "\n\n".join(
        f"""
        Timestamp: {int(chunk.start_time // 60):02d}:{int(chunk.start_time % 60):02d}
        to
        {int(chunk.end_time // 60):02d}:{int(chunk.end_time % 60):02d}

        {chunk.content}
        """
            for chunk in chunks
        )
    
    session = await ChatSessionRepository.get_or_create(
        db=db,
        video_id=video_id,
        user_id=current_user.id,
    )

    await ChatMessageRepository.create(
        db=db,
        session_id=session.id,
        role="user",
        content=payload.question,
    )
    await db.flush()
    history = await ChatMessageRepository.get_history(
        db=db,
        session_id=session.id,
    )

    history_text = "\n".join(
        f"{msg.role.capitalize()}: {msg.content}"
        for msg in history
    )

    answer = GeneratorService.generate(
        context=context,
        question=payload.question,
        history=history_text,
    )

    await ChatMessageRepository.create(
        db=db,
        session_id=session.id,   
        role="assistant",
        content=answer,
    )

    await db.commit()

    return ChatResponse(
        answer=answer,
        sources=[
            Source(
                chunk_index=c.chunk_index,
                content=c.content,
                start_time=c.start_time,
                end_time=c.end_time,
            )
            for c in chunks
        ],
    )

@router.post("/{video_id}/chat/stream")
async def stream_chat_with_video(
    video_id: UUID,
    payload: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    video = await VideoRepository.get_by_id(
        db=db,
        video_id=video_id,
    )

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found",
        )

    if video.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized",
        )

    chunks = await RetrievalService.retrieve(
        db=db,
        video_id=video_id,
        query=payload.question,
    )

    context = "\n\n".join(
        f"""
            Timestamp: {int(chunk.start_time // 60):02d}:{int(chunk.start_time % 60):02d}
            to
            {int(chunk.end_time // 60):02d}:{int(chunk.end_time % 60):02d}

            {chunk.content}
        """
        for chunk in chunks
    )

    session = await ChatSessionRepository.get_or_create(
        db=db,
        video_id=video_id,
        user_id=current_user.id,
    )
    
    await ChatMessageRepository.create(
        db=db,
        session_id=session.id,
        role="user",
        content=payload.question,
    )

    await db.flush()

    history = await ChatMessageRepository.get_history(
        db=db,
        session_id=session.id,
    )

    history_text = "\n".join(
        f"{msg.role.capitalize()}: {msg.content}"
        for msg in history
    )

    async def generate():

        full_answer = ""

        async for token in GeneratorService.stream_generate(
            context=context,
            question=payload.question,
            history=history_text,
        ):
            full_answer += token
            yield token

        await ChatMessageRepository.create(
            db=db,
            session_id=session.id,
            role="assistant",
            content=full_answer,
        )

        await db.commit()

    return StreamingResponse(
        generate(),
        media_type="text/plain",
    )

