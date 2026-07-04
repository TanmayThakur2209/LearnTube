import os
from celery import Celery
from app.core.config import settings
# REDIS_URL = os.getenv("REDIS_URL")

celery_app = Celery(
    "learnTube",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.video_tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)

celery_app.conf.imports = (
    "app.tasks.video_tasks",
)

from app.core.config import settings
print("REDIS_URL =", settings.REDIS_URL)