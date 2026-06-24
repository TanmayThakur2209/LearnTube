from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.core.exceptions import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
)
from app.db.session import get_db
from app.schemas.user import (
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.services.auth_service import AuthService
from app.repositories.video_repository import VideoRepository

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=TokenResponse,
)
async def register(
    data: UserRegister,
    db: AsyncSession = Depends(get_db),
):
    try:
        _, token = await AuthService.register(
            db,
            data,
        )

        return TokenResponse(
            access_token=token,
        )

    except UserAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists.",
        )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    data: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    try:
        _, token = await AuthService.login(
            db,
            data,
        )

        return TokenResponse(
            access_token=token,
        )

    except InvalidCredentialsError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
        )

@router.get("/me", response_model=UserResponse)
async def me(
    current_user: User = Depends(get_current_user),
):
    return current_user

@router.get("/stats")
async def get_user_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    videos = await VideoRepository.count_by_owner(
        db=db,
        owner_id=current_user.id,
    )

    return {
        "videos": videos,
        "joined_at": current_user.created_at,
    }