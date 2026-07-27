import time
from app.logger import get_logger
from app.metrics import LocalFaceMetrics
from app.multimodal import OllamaVisionAnalyzer
from app.beauty_model import BeautyScoreModel

logger = get_logger("Pipeline")

class VisageIQPipeline:
    def __init__(self):
        logger.info("[INIT] Initializing Visage IQ local computer vision & AI engines...")
        self.metrics_engine = LocalFaceMetrics()
        self.vision_analyzer = OllamaVisionAnalyzer()
        self.beauty_model = BeautyScoreModel()
        logger.info("[INIT COMPLETE] All pipeline engines initialized successfully.")

    def process_image(self, image_bytes: bytes) -> dict:
        start_time = time.time()
        logger.info("================================================================")
        logger.info("🚀 [START] Starting Visage IQ Facial Analysis Pipeline...")

        # -------------------------------------------------------------------------
        # STEP 1: Quantitative Facial Metrics (MediaPipe 468 Landmark Mesh)
        # -------------------------------------------------------------------------
        logger.info("📍 [STEP 1/3] Extracting 468 3D facial mesh landmarks via MediaPipe...")
        landmarks_data, image_shape, err = self.metrics_engine.extract_landmarks_from_bytes(image_bytes)

        if err or landmarks_data is None:
            logger.warning(f"⚠️ [STEP 1/3 WARNING] Landmark extraction fallback ({err or 'No face detected'}).")
            quant_data = {
                "fwhr_ratio": 0.0,
                "horizontal_symmetry_pct": 0.0,
                "golden_ratio_harmony_pct": 0.0,
                "face_width_px": 0.0,
                "face_height_px": 0.0,
                "total_face_height_px": 0.0,
                "jaw_width_px": 0.0,
                "jaw_to_cheek_ratio": 0.0,
                "intercanthal_distance_px": 0.0,
                "eye_width_symmetry_pct": 0.0,
                "hud_mesh_points": [],
                "error": err or "No face detected"
            }
        else:
            quant_data = self.metrics_engine.calculate_symmetry_and_ratios(landmarks_data)
            logger.info(
                f"✅ [STEP 1/3 COMPLETED] Dimensions={image_shape[1]}x{image_shape[0]}px | "
                f"fWHR={quant_data['fwhr_ratio']} | Symmetry={quant_data['horizontal_symmetry_pct']}% | "
                f"Jaw/Cheek={quant_data['jaw_to_cheek_ratio']}"
            )

        # -------------------------------------------------------------------------
        # STEP 2: Qualitative Reasoning via Local Ollama Multimodal Vision LLM
        # -------------------------------------------------------------------------
        logger.info("🤖 [STEP 2/3] Invoking local Ollama multimodal vision model for domain archetype reasoning...")
        qual_data = self.vision_analyzer.analyze_face_image(image_bytes, quant_data)
        
        archetype = qual_data.get("domain_and_profession_archetype", {}).get("primary_domain", "N/A")
        logger.info(f"✅ [STEP 2/3 COMPLETED] Archetype detected: '{archetype}'")

        # -------------------------------------------------------------------------
        # STEP 3: SCUT-FBP5500 Facial Harmony Score via PyTorch
        # -------------------------------------------------------------------------
        logger.info("⚖️ [STEP 3/3] Calculating SCUT-FBP5500 facial harmony score via PyTorch MPS/CPU...")
        beauty_data = self.beauty_model.calculate_score(image_bytes, quant_data)
        logger.info(
            f"✅ [STEP 3/3 COMPLETED] Score={beauty_data['score_5_scale']}/5.0 | "
            f"Percentile={beauty_data['percentile']}% | Tier={beauty_data['harmony_tier']} | "
            f"Accelerator={beauty_data['accelerator']}"
        )

        elapsed = round(time.time() - start_time, 2)
        logger.info(f"🏁 [PIPELINE FINISHED] Total execution time: {elapsed} seconds.")
        logger.info("================================================================")

        return {
            "status": "success",
            "execution_time_seconds": elapsed,
            "image_dimensions": {"height": image_shape[0], "width": image_shape[1]},
            "quantitative_metrics": quant_data,
            "qualitative_analysis": qual_data,
            "beauty_harmony_score": beauty_data
        }
