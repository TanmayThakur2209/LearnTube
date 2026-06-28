from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    APP_NAME: str = "LearnTube"
    APP_ENV: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str
    REDIS_URL: str

    JWT_SECRET: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10000

    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    YOUTUBE_API_KEY: str = ""

@lru_cache
def get_settings():
    return Settings()

settings = get_settings()