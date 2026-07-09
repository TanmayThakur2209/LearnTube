print("1")

from fastapi import FastAPI
print("2")

from fastapi.middleware.cors import CORSMiddleware
print("3")

from app.core.config import settings
print("4")

from app.api.auth import router as auth_router
print("5")

from app.api.video import router as video_router
print("6")

app = FastAPI()

print("7")

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="LearnTube Backend API",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://learntubeai.vercel.app",
    ],
    allow_credentials=True,
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