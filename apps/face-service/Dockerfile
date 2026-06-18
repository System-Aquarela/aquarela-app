FROM python:3.11-slim

WORKDIR /app
ENV PIP_DEFAULT_TIMEOUT=180 \
  PIP_RETRIES=10 \
  PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  libgl1 \
  libglib2.0-0 \
  && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN mkdir -p /models \
  && curl -L --fail --retry 5 -o /models/face_detection_yunet_2023mar.onnx \
    https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx \
  && curl -L --fail --retry 5 -o /models/face_recognition_sface_2021dec.onnx \
    https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx
COPY main.py .
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=5s --retries=10 CMD curl --fail http://localhost:8000/health || exit 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
