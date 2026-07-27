# 👁️ Visage IQ

> **100% Local Facial Feature, Domain Archetype, & Attractiveness Intelligence Engine**  
> Powered by MediaPipe 3D Landmark Mesh, PyTorch MPS Acceleration, and Ollama Multimodal Vision LLMs.

![Privacy Badge](https://img.shields.io/badge/Privacy-100%25%20Offline-10B981?style=for-the-badge&logo=shield)
![Apple Silicon](https://img.shields.io/badge/Accelerated-Apple%20Silicon%20MPS-8B5CF6?style=for-the-badge&logo=apple)
![License](https://img.shields.io/badge/License-MIT-F43F5E?style=for-the-badge)

---

## ✨ Features

- **📍 468 3D Landmark Mesh HUD**: Extracts precise facial width-to-height ratio (fWHR), horizontal symmetry parity %, jaw-to-cheek ratio, and eye symmetry using MediaPipe & OpenCV.
- **⚖️ SCUT-FBP5500 Facial Harmony Engine**: Evaluates golden ratio facial proportions and percentile distributions accelerated via PyTorch Metal Performance Shaders (MPS GPU).
- **🤖 Local Vision LLM Archetype Reasoning**: Runs local multimodal LLMs (`llava-phi3:latest`, `qwen2.5vl:7b`, or `llama3.2-vision`) via Ollama to analyze visual cues, presence markers, and primary domain archetypes (Executive, Scholar, Athlete, Creative, etc.).
- **📸 WebCam Live Capture & File Upload**: Real-time camera snapshot tool with face alignment overlay, or drag-and-drop file upload (JPG, PNG, WebP).
- **🔒 100% Offline & Private**: Zero external API calls. All computations run locally on your device.
- **📊 Exportable JSON Reports**: Download complete structured analysis reports with single-click JSON export.

---

## 🛠️ Architecture Overview

```
 ┌─────────────────────────────────────────────────────────┐
 │                   React 18 + Vite UI                    │
 │         (Live HUD Canvas, WebCam, Sunset Theme)         │
 └────────────────────────────┬────────────────────────────┘
                              │ HTTP / REST
 ┌────────────────────────────▼────────────────────────────┐
 │                 FastAPI Backend Server                  │
 └───────┬────────────────────┼────────────────────┬───────┘
         │                    │                    │
 ┌───────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
 │   MediaPipe    │  │   PyTorch MPS   │  │   Local Ollama │
 │ 468 3D Mesh    │  │  Harmony Score  │  │  Vision LLM    │
 └────────────────┘  └─────────────────┘  └────────────────┘
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Python**: 3.10+
- **Node.js**: 18+
- **Ollama**: [Download Ollama](https://ollama.com) and pull a vision model:
  ```bash
  ollama pull llava-phi3:latest
  ```

### 2. Clone & Launch
```bash
git clone https://github.com/your-username/visage-iq.git
cd visage-iq

# Make startup script executable and run
chmod +x start.sh
./start.sh
```

`./start.sh` automatically:
- Provisions Python virtual environment (`venv`) & node modules (`node_modules`)
- Frees up ports `8000` & `5173` if occupied
- Configures structured logging in `backend/logs/` and `frontend/logs/`
- Launches FastAPI Backend on `http://localhost:8000` & React Frontend on `http://localhost:5173`

---

## ⚙️ Environment Configuration

Copy the example environment files:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### Backend `.env`
```ini
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
OLLAMA_MODEL=llava-phi3:latest
OLLAMA_HOST=http://localhost:11434
```

### Frontend `.env`
```ini
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📂 Project Structure

```
visage-iq/
├── backend/
│   ├── app/
│   │   ├── beauty_model.py    # PyTorch SCUT-FBP5500 Harmony Score
│   │   ├── logger.py          # Structured File & Console Logger
│   │   ├── metrics.py         # MediaPipe 468 Landmark Mesh Engine
│   │   ├── multimodal.py      # Ollama Vision LLM Reasoning
│   │   └── pipeline.py        # Central Visage IQ Orchestrator
│   ├── logs/                  # Backend Log Storage
│   ├── main.py                # FastAPI REST API & Demo Endpoints
│   └── requirements.txt       # Python Dependencies
├── frontend/
│   ├── src/
│   │   ├── components/        # AnalysisDashboard, FacialHUD, ImageUploader
│   │   ├── App.jsx            # Main React Application Component
│   │   └── index.css          # Positive Vibe Glassmorphism Theme
│   └── package.json           # Frontend Dependencies
├── .env.example               # Root Configuration Template
├── start.sh                   # One-click Application Startup Script
└── LICENSE                    # MIT License
```

---
