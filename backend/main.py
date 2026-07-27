import io
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.pipeline import VisageIQPipeline

app = FastAPI(
    title="Visage IQ Backend",
    description="100% Local Facial Feature, Domain Archetype, and Attractiveness Analysis API",
    version="1.0.0"
)

import os

# Enable CORS for React frontend
cors_origins_raw = os.getenv("CORS_ORIGINS", "*")
cors_origins = [o.strip() for o in cors_origins_raw.split(",")] if cors_origins_raw != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = VisageIQPipeline()

@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "Visage IQ Local Analysis Engine",
        "version": "1.0.0",
        "device": "Apple Silicon MPS / CPU Unified Architecture"
    }

@app.post("/api/analyze")
async def analyze_face(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image (JPEG/PNG/WebP).")

    try:
        contents = await file.read()
        results = pipeline.process_image(contents)
        return JSONResponse(content=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {str(e)}")

@app.get("/api/demo")
def run_demo_analysis():
    """Generates a synthetic portrait image to demonstrate real-time pipeline execution."""
    try:
        # Generate a clean 600x600 synthetic face image canvas for testing
        img = np.zeros((600, 600, 3), dtype=np.uint8)
        img[:] = (30, 25, 20)  # Dark slate background

        # Draw a synthetic oval face contour and eyes/nose/mouth shapes for MediaPipe / fallback test
        cv2.ellipse(img, (300, 300), (140, 190), 0, 0, 360, (210, 180, 160), -1)
        cv2.circle(img, (240, 260), 22, (255, 255, 255), -1)
        cv2.circle(img, (360, 260), 22, (255, 255, 255), -1)
        cv2.circle(img, (240, 260), 10, (80, 50, 20), -1)
        cv2.circle(img, (360, 260), 10, (80, 50, 20), -1)
        cv2.line(img, (300, 280), (300, 330), (160, 120, 100), 4)
        cv2.ellipse(img, (300, 380), (60, 25), 0, 0, 180, (140, 60, 80), -1)

        _, encoded = cv2.imencode(".jpg", img)
        image_bytes = encoded.tobytes()

        results = pipeline.process_image(image_bytes)
        return JSONResponse(content=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Demo execution failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host=host, port=port, reload=True)
