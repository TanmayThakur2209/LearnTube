import os
from celery import Celery

REDIS_URL = os.getenv("REDIS_URL")

celery_app = Celery(
    "learnTube",
    broker=REDIS_URL,
    backend=REDIS_URL,
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