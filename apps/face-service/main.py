import base64
import os
import threading
from typing import Any

import cv2
import numpy as np
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI(title="Aquarela Face Service", version="1.0.0")

DETECTOR_PATH = os.getenv("AQUARELA_FACE_DETECTOR", "/models/face_detection_yunet_2023mar.onnx")
RECOGNIZER_PATH = os.getenv("AQUARELA_FACE_RECOGNIZER", "/models/face_recognition_sface_2021dec.onnx")
DEFAULT_THRESHOLD = float(os.getenv("AQUARELA_FACE_THRESHOLD", "0.363"))

_detector = None
_recognizer = None
_model_error: str | None = None
_model_lock = threading.Lock()


def _load_models():
    global _detector, _recognizer, _model_error
    if _detector is not None and _recognizer is not None:
        return _detector, _recognizer
    if _model_error:
        raise RuntimeError(_model_error)

    try:
        detector_create = getattr(cv2, "FaceDetectorYN_create", None)
        recognizer_create = getattr(cv2, "FaceRecognizerSF_create", None)
        if not detector_create or not recognizer_create:
            raise RuntimeError("A instalação do OpenCV não inclui YuNet/SFace.")
        _detector = detector_create(DETECTOR_PATH, "", (320, 320), 0.85, 0.3, 5000)
        _recognizer = recognizer_create(RECOGNIZER_PATH, "")
        return _detector, _recognizer
    except Exception as exc:
        _model_error = str(exc)
        raise


def _decode_image(data: bytes):
    arr = np.frombuffer(data, dtype=np.uint8)
    image = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Imagem inválida.")
    return image


def _extract_embeddings(data: bytes, require_single: bool):
    image = _decode_image(data)
    height, width = image.shape[:2]

    try:
        with _model_lock:
            detector, recognizer = _load_models()
            detector.setInputSize((width, height))
            _, faces = detector.detect(image)
            if faces is None or len(faces) == 0:
                raise HTTPException(status_code=422, detail="Nenhum rosto foi detectado. Use uma foto frontal e bem iluminada.")
            if require_single and len(faces) != 1:
                raise HTTPException(status_code=422, detail="A foto de treinamento deve conter exatamente um rosto.")

            ordered = sorted(faces, key=lambda face: float(face[2] * face[3]), reverse=True)
            embeddings = []
            for face in ordered[:5]:
                aligned = recognizer.alignCrop(image, face)
                feature = recognizer.feature(aligned).flatten().astype(np.float32)
                norm = float(np.linalg.norm(feature))
                if norm:
                    embeddings.append((feature / norm).tolist())
            if not embeddings:
                raise HTTPException(status_code=422, detail="Não foi possível gerar uma representação facial válida.")
            return embeddings
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Modelos faciais indisponíveis: {exc}") from exc


class MatchCandidate(BaseModel):
    faceImageId: str | None = None
    personId: str
    embedding: Any


class MatchRequest(BaseModel):
    image: str
    candidates: list[MatchCandidate]
    threshold: float | None = None


@app.get("/health")
def health():
    try:
        _load_models()
        return {"ok": True, "ready": True, "model": "opencv-yunet-sface", "threshold": DEFAULT_THRESHOLD}
    except Exception as exc:
        return JSONResponse(status_code=503, content={"ok": False, "ready": False, "detail": str(exc)})


@app.post("/embed")
async def embed(request: Request):
    data = await request.body()
    embeddings = _extract_embeddings(data, require_single=True)
    return {"embedding": embeddings[0], "faceCount": 1, "model": "opencv-yunet-sface"}


@app.post("/match")
def match(payload: MatchRequest):
    try:
        image_bytes = base64.b64decode(payload.image, validate=True)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Imagem em base64 inválida.") from exc

    probes = [np.array(item, dtype=np.float32) for item in _extract_embeddings(image_bytes, require_single=False)]
    threshold = payload.threshold if payload.threshold is not None else DEFAULT_THRESHOLD
    best_by_person: dict[str, dict[str, Any]] = {}

    for candidate in payload.candidates:
        if not isinstance(candidate.embedding, list) or not candidate.embedding:
            continue
        enrolled = np.array(candidate.embedding, dtype=np.float32)
        enrolled_norm = float(np.linalg.norm(enrolled))
        if not enrolled_norm:
            continue
        enrolled = enrolled / enrolled_norm

        for probe in probes:
            if enrolled.shape != probe.shape:
                continue
            score = float(np.dot(probe, enrolled))
            if score < threshold:
                continue
            previous = best_by_person.get(candidate.personId)
            if previous is None or score > previous["score"]:
                best_by_person[candidate.personId] = {
                    "personId": candidate.personId,
                    "faceImageId": candidate.faceImageId,
                    "score": score,
                }

    matches = sorted(best_by_person.values(), key=lambda item: item["score"], reverse=True)
    return {"matches": matches[:5], "facesDetected": len(probes), "threshold": threshold}
