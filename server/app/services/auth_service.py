from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.hashing import (
    hash_password,
    verify_password,
)
from app.auth.jwt import create_access_token
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserLogin, UserRegister
from app.core.exceptions import (UserAlreadyExistsError,InvalidCredentialsError)



class AuthService:
    @staticmethod
    async def register(
        db: AsyncSession,
        data: UserRegister,
    ):
        existing = await UserRepository.get_by_email(
            db,
            data.email,
        )

        if existing:
            raise UserAlreadyExistsError()      

        user = User(
            email=data.email,
            password_hash=hash_password(
                data.password
            ),
            name=data.name,
        )

        user = await UserRepository.create(
            db,
            user,
        )

        token = create_access_token(
            str(user.id)
        )

        return user, token

    @staticmethod
    async def login(
        db: AsyncSession,
        data: UserLogin,
    ):
        user = await UserRepository.get_by_email(
            db,
            data.email,
        )

        if (
            user is None
            or user.password_hash is None
        ):
            raise InvalidCredentialsError()

        if not verify_password(
            data.password,
            user.password_hash,
        ):
            raise InvalidCredentialsError()

        token = create_access_token(
            str(user.id)
        )

        return user, token