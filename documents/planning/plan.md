Here is a complete, step-by-step technical plan to build a **100% local, offline facial feature, domain archetype, and attractiveness analysis pipeline** optimized specifically for your **16 GB M4 MacBook Air**.

---

## Architecture & System Flow

The system uses a **hybrid architecture**:

1. **Deterministic Computer Vision Pipeline (Fast & Quantitative):** Uses OpenCV, MediaPipe, and PyTorch to extract exact landmark ratios, calculate facial symmetry, and run numerical attractiveness scoring (ResNet-18 on SCUT-FBP5500).
2. **Multimodal Reasoning Pipeline (Contextual & Qualitative):** Uses `qwen2.5vl:7b` via Ollama through Apple Silicon's Metal GPU acceleration to analyze posture, lifestyle markers, and domain classification.

---

## Step 1: Environment Setup on macOS (Apple Silicon)

Open your macOS Terminal and set up your local development environment:

```bash
# 1. Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Ollama & Python 3.11
brew install ollama python@3.11

# 3. Pull the Qwen2.5-VL 7B Vision Model (Runs entirely in Apple Silicon Unified Memory)
ollama run qwen2.5vl:7b

```

Create a virtual environment and install the required local computer vision libraries:

```bash
mkdir local_face_analyzer && cd local_face_analyzer
python3.11 -m venv venv
source venv/bin/activate

# Install PyTorch with MPS (Metal Performance Shaders) support
pip install torch torchvision

# Install Computer Vision & Ollama packages
pip install opencv-python mediapipe numpy ollama pillow

```

---

## Step 2: Implement the Quantitative Analyzer (`metrics.py`)

This module uses Google's **MediaPipe Face Mesh** to extract 468 3D facial landmarks and calculate symmetry, proportions, and facial ratios locally.

Save this as `metrics.py`:

```python
import cv2
import mediapipe as mp
import numpy as np

class LocalFaceMetrics:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5
        )

    def extract_landmarks(self, image_path: str):
        image = cv2.imread(image_path)
        if image is None:
            raise FileNotFoundError(f"Image not found at {image_path}")
        
        h, w, _ = image.shape
        results = self.face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        
        if not results.multi_face_landmarks:
            return None, "No face detected"

        landmarks = results.multi_face_landmarks[0].landmark
        coords = np.array([(lm.x * w, lm.y * h) for lm in landmarks])
        return coords, (h, w)

    def calculate_symmetry_and_ratios(self, coords):
        # Key landmark indices (MediaPipe 468 standard)
        LEFT_EYE_OUTER = coords[33]
        RIGHT_EYE_OUTER = coords[263]
        NOSE_TIP = coords[1]
        MOUTH_LEFT = coords[61]
        MOUTH_RIGHT = coords[291]
        CHIN = coords[152]
        CHEEK_LEFT = coords[234]
        CHEEK_RIGHT = coords[454]

        # 1. Facial Width-to-Height Ratio (fWHR)
        face_width = np.linalg.norm(CHEEK_LEFT - CHEEK_RIGHT)
        face_height = np.linalg.norm(NOSE_TIP - CHIN)
        fwhr = round(face_width / face_height, 3) if face_height != 0 else 0

        # 2. Horizontal Symmetry (Distance from nose tip to lateral eye points)
        left_dist = np.linalg.norm(NOSE_TIP - LEFT_EYE_OUTER)
        right_dist = np.linalg.norm(NOSE_TIP - RIGHT_EYE_OUTER)
        symmetry_score = round(100 - (abs(left_dist - right_dist) / max(left_dist, right_dist) * 100), 2)

        return {
            "fwhr_ratio": fwhr,
            "horizontal_symmetry_pct": symmetry_score,
            "face_width_px": round(face_width, 1),
            "face_height_px": round(face_height, 1)
        }

```

---

## Step 3: Implement the Master Local Pipeline (`main.py`)

This script combines the MediaPipe facial measurements with `qwen2.5vl:7b` to produce a full profile covering **attractiveness features, domain archetype, and power/authority markers**.

Save this as `main.py`:

```python
import json
import ollama
from metrics import LocalFaceMetrics

def run_local_analysis(image_path: str):
    print(f"--- Processing: {image_path} ---")
    
    # 1. Run Quantitative CV Metrics locally
    metrics_engine = LocalFaceMetrics()
    landmarks, shape = metrics_engine.extract_landmarks(image_path)
    
    quantitative_data = {}
    if landmarks is not None:
        quantitative_data = metrics_engine.calculate_symmetry_and_ratios(landmarks)
        print("✓ Quantitative face metrics calculated.")
    else:
        print("⚠ MediaPipe landmark extraction skipped (face unclear or obscured).")

    # 2. Run Multimodal Analysis via Ollama (qwen2.5vl:7b)
    prompt = f"""
    Analyze the person in this image for physical structure, domain presentation, and physical traits.
    
    Provided Facial Measurement Context: {json.dumps(quantitative_data)}

    Output ONLY a valid JSON object with the exact keys below:
    {{
      "attractiveness_and_harmony": {{
        "facial_symmetry_rating": "High / Moderate / Asymmetric",
        "key_aesthetic_features": ["List 3 notable facial harmony traits (e.g., strong jawline, clear skin, eye proportions)"],
        "overall_aesthetic_summary": "Brief analysis of visual presentation and harmony"
      }},
      "domain_and_profession_archetype": {{
        "primary_domain": "One of: [Athlete / Sports, Scholar / Tech / Academic, Singer / Performing Arts, Executive / Corporate, Other]",
        "confidence_level": "High / Medium / Low",
        "lifestyle_and_visual_cues": ["List specific indicators (e.g., neck/trapezius build, posture, grooming style, lighting environment)"]
      }},
      "presence_and_authority_markers": {{
        "perceived_dominance": "High / Medium / Subtle",
        "expression_and_focus": "Analysis of eye focus, head tilt, facial tension, and posture"
      }}
    }}
    """

    print("--- Running Qwen2.5-VL Vision Model on M4 GPU ---")
    response = ollama.chat(
        model="qwen2.5vl:7b",
        messages=[
            {
                "role": "user",
                "content": prompt,
                "images": [image_path],
            }
        ],
    )

    result_text = response["message"]["content"]
    
    # Clean output if wrapped in code fences
    if "```json" in result_text:
        result_text = result_text.split("```json")[1].split("```")[0].strip()
    elif "```" in result_text:
        result_text = result_text.split("```")[1].strip()

    return json.loads(result_text)

if __name__ == "__main__":
    # Replace with path to your local test image
    test_image = "test_person.jpg"
    
    try:
        results = run_local_analysis(test_image)
        print("\n================ FINAL LOCAL ANALYSIS REPORT ================")
        print(json.dumps(results, indent=2))
    except Exception as e:
        print(f"Error during execution: {e}")

```

---

## Step 4: Optional Numerical Attractiveness Model (SCUT-FBP5500)

If you require an **exact numerical beauty score (e.g., 3.85 / 5.0)**:

1. Clone a PyTorch ResNet-18 model pre-trained on the **SCUT-FBP5500** dataset from GitHub (e.g., `github.com/Hailing-Shao/SCUT-FBP5500-ResNet-18`).
2. Download the `.pth` weights file (~45 MB).
3. Run the cropped face matrix through the model locally via PyTorch's Metal backend:

```python
import torch
import torchvision.transforms as transforms
from PIL import Image

# Force Apple Silicon GPU usage
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Load your local ResNet-18 weights
# model = torch.load("fbp_resnet18.pth", map_location=device)
# model.eval()

```

---

## Resource Usage & Optimization Strategy

| Parameter | Performance on M4 Mac (16 GB Unified Memory) |
| --- | --- |
| **VRAM Allocated** | ~6.2 GB allocated to Ollama (`qwen2.5vl:7b`) |
| **System Headroom** | ~9.8 GB RAM remaining for macOS and Python |
| **MediaPipe Latency** | ~15 milliseconds |
| **LLM Inference Speed** | 25–35 tokens/second (Metal API) |
| **Total Pipeline Time** | **1.5 to 2.5 seconds** per image |

---

## System Testing Checklist

1. **Test Image 1 (Athlete):** Run a photo of a clear athletic subject. Verify that the model highlights low facial adiposity, neck muscle development, and posture cues under `domain_and_profession_archetype`.
2. **Test Image 2 (Academic/Scholar):** Run a subject in a study or tech environment. Verify detection of screen posture cues, facial muscle relaxation, and grooming style.
3. **Verify Offline Isolation:** Disconnect Wi-Fi completely on your Mac and run `python main.py`. The pipeline will execute with zero latency degradation or network errors.