FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN echo "Docker build completed"

CMD ["python", "-u", "-c", "print('before'); import app.main; print('after')"]