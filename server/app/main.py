from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.video import router as video_router

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="LearnTube Backend API",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(video_router)

@app.get("/")
async def root():
    return {
        "message": f"{settings.APP_NAME} API is running 🚀",
        "environment": settings.APP_ENV,
    }