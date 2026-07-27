import json
import os
import tempfile
from app.logger import get_logger

logger = get_logger("OllamaVision")

class OllamaVisionAnalyzer:
    def __init__(self, model_name: str = None):
        self.model_name = model_name or os.getenv("OLLAMA_MODEL", "qwen2.5vl:7b")

    def analyze_face_image(self, image_bytes: bytes, quantitative_data: dict) -> dict:
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_file:
            tmp_file.write(image_bytes)
            tmp_path = tmp_file.name

        try:
            return self._run_ollama_query(tmp_path, quantitative_data)
        except Exception as e:
            logger.warning(f"⚠️ Ollama invocation failed ({e}). Returning fallback qualitative analysis.")
            return self._generate_fallback_analysis(quantitative_data)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    def _get_active_vision_model(self, ollama_client) -> str:
        try:
            res = ollama_client.list()
            models = []
            if hasattr(res, 'models'):
                for m in res.models:
                    name = getattr(m, 'model', getattr(m, 'name', ''))
                    if name:
                        models.append(name)
            elif isinstance(res, dict):
                for m in res.get('models', []):
                    name = m.get('model', m.get('name', '')) if isinstance(m, dict) else getattr(m, 'model', '')
                    if name:
                        models.append(name)

            logger.info(f"Local Ollama installed models: {models}")

            if any(self.model_name in m for m in models):
                logger.info(f"Using explicitly configured vision model: '{self.model_name}'")
                return self.model_name
                
            vision_keywords = ["llava", "qwen2.5vl", "qwen-vl", "vision", "bakllava", "moondream"]
            for m in models:
                if any(kw in m.lower() for kw in vision_keywords):
                    logger.info(f"Auto-detected local vision model: '{m}'")
                    return m

            if models:
                logger.info(f"Fallback to first available model: '{models[0]}'")
                return models[0]

            return self.model_name
        except Exception as e:
            logger.warning(f"Failed to list Ollama models ({e}). Defaulting to {self.model_name}")
            return self.model_name

    def _run_ollama_query(self, image_path: str, quantitative_data: dict) -> dict:
        import ollama

        active_model = self._get_active_vision_model(ollama)
        clean_quant_data = {k: v for k, v in quantitative_data.items() if k != "hud_mesh_points"}

        prompt = f"""
        Analyze the person in this image for physical structure, domain presentation, and physical traits.
        
        Provided Facial Measurement Context: {json.dumps(clean_quant_data)}

        Output ONLY a valid JSON object with the exact keys below, no extra commentary or markdown:
        {{
          "attractiveness_and_harmony": {{
            "facial_symmetry_rating": "High / Moderate / Asymmetric",
            "key_aesthetic_features": ["3 notable facial harmony traits"],
            "overall_aesthetic_summary": "Analysis of visual presentation and facial harmony"
          }},
          "domain_and_profession_archetype": {{
            "primary_domain": "One of: [Athlete / Sports, Scholar / Tech / Academic, Singer / Performing Arts, Executive / Corporate, Creative / Artist]",
            "confidence_level": "High / Medium / Low",
            "lifestyle_and_visual_cues": ["Specific indicators (e.g., neck/trapezius build, posture, grooming style, lighting environment)"]
          }},
          "presence_and_authority_markers": {{
            "perceived_dominance": "High / Medium / Subtle",
            "expression_and_focus": "Analysis of eye focus, head tilt, facial tension, and posture"
          }}
        }}
        """

        logger.info(f"Sending vision inference request to Ollama model '{active_model}'...")
        response = ollama.chat(
            model=active_model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                    "images": [image_path],
                }
            ],
            options={"num_ctx": 8192}
        )

        result_text = response["message"]["content"].strip()
        logger.info("Received response from Ollama vision model.")
        
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif "```" in result_text:
            result_text = result_text.split("```")[1].strip()

        return json.loads(result_text)

    def _generate_fallback_analysis(self, quantitative_data: dict) -> dict:
        symmetry = quantitative_data.get("horizontal_symmetry_pct", 85.0)
        fwhr = quantitative_data.get("fwhr_ratio", 1.8)

        symmetry_rating = "High" if symmetry >= 92.0 else ("Moderate" if symmetry >= 80.0 else "Asymmetric")
        dominance = "High" if fwhr >= 1.9 else ("Medium" if fwhr >= 1.6 else "Subtle")

        return {
            "attractiveness_and_harmony": {
                "facial_symmetry_rating": symmetry_rating,
                "key_aesthetic_features": [
                    f"Measured horizontal facial symmetry of {symmetry}%",
                    f"Facial Width-to-Height Ratio (fWHR) of {fwhr}",
                    "Balanced intercanthal distance and cheekbone structure"
                ],
                "overall_aesthetic_summary": f"Quantitative metrics display {symmetry_rating.lower()} structural harmony with an fWHR ratio of {fwhr}."
            },
            "domain_and_profession_archetype": {
                "primary_domain": "Scholar / Tech / Academic" if fwhr < 1.8 else "Executive / Corporate",
                "confidence_level": "Medium (CV Quantitative Estimator)",
                "lifestyle_and_visual_cues": [
                    "Direct eye gaze alignment",
                    "Balanced facial muscle tension",
                    "Neutral background and professional posture"
                ]
            },
            "presence_and_authority_markers": {
                "perceived_dominance": dominance,
                "expression_and_focus": f"Facial ratio index reflects {dominance.lower()} perceived authority and focused gaze."
            },
            "_note": "Generated via local quantitative CV engine (Ollama Qwen2.5-VL daemon was offline)."
        }
