import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

DATABASE_URL = "postgresql+asyncpg://learnTube:learnTubepassword@127.0.0.1:5432/learnTube"

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={
        "ssl": False,
    },
)

async def main():
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT 1"))

    await engine.dispose()

asyncio.run(main())