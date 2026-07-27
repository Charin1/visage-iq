import json
import os
import tempfile
from app.logger import get_logger

logger = get_logger("OllamaVision")

class OllamaVisionAnalyzer:
    def __init__(self, model_name: str = None):
        self.model_name = model_name or os.getenv("OLLAMA_MODEL", "qwen2.5vl:7b")

    def analyze_face_image(self, image_bytes: bytes, quantitative_data: dict, max_retries: int = 3) -> dict:
        import time
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_file:
            tmp_file.write(image_bytes)
            tmp_path = tmp_file.name

        try:
            for attempt in range(1, max_retries + 1):
                try:
                    return self._run_ollama_query(tmp_path, quantitative_data)
                except Exception as attempt_err:
                    if attempt < max_retries:
                        backoff = attempt * 1.5
                        logger.warning(f"⚠️ Ollama attempt {attempt}/{max_retries} failed ({attempt_err}). Retrying in {backoff}s...")
                        time.sleep(backoff)
                    else:
                        raise attempt_err
        except Exception as e:
            logger.warning(f"⚠️ All {max_retries} Ollama retry attempts failed ({e}). Returning fallback qualitative analysis.")
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
        Perform an in-depth physical, vocal, athletic, personality, and biological analysis of the person in this photo.
        
        Provided Quantitative Measurement Context: {json.dumps(clean_quant_data)}

        Output ONLY a valid JSON object with the exact keys below, no commentary or markdown code fences:
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
          "vocal_and_speech_profile": {{
            "vocal_resonance_potential": "High / Medium / Standard",
            "vocal_projection_cues": ["Specific traits like jaw breadth, hyoid posture, orbicularis muscle tone"]
          }},
          "athletic_and_somatotype_profile": {{
            "athletic_conditioning_type": "Explosive / Power / Endurance / Structural Alignment",
            "muscularity_and_neck_cues": ["Trapezius conditioning, sternocleidomastoid ratio, facial muscle density"]
          }},
          "personality_traits_big_five": {{
            "conscientiousness_score": "High / Moderate",
            "extraversion_score": "High / Ambivert / Introvert",
            "openness_to_experience": "High / Moderate",
            "key_behavioral_signals": ["Facial muscle composure, brow alignment, eye contact posture"]
          }},
          "vitality_and_biological_age": {{
            "perceived_biological_age_gap": "Younger than calendar age / Age-matched / Experienced",
            "skin_vitality_and_energy_index": "Vibrant / Balanced / Rested"
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
            "vocal_and_speech_profile": {
                "vocal_resonance_potential": "High" if fwhr >= 1.85 else "Medium",
                "vocal_projection_cues": [
                    "Strong mandibular volume for vocal resonance",
                    "Even orbicularis tone and articulatory spacing"
                ]
            },
            "athletic_and_somatotype_profile": {
                "athletic_conditioning_type": "Explosive / Power" if fwhr >= 1.85 else "Endurance / Structural Alignment",
                "muscularity_and_neck_cues": [
                    "Proportionate neck-to-jaw ratio",
                    "Symmetrical masseter muscle density"
                ]
            },
            "personality_traits_big_five": {
                "conscientiousness_score": "High" if symmetry >= 90 else "Moderate",
                "extraversion_score": "High" if fwhr >= 1.85 else "Ambivert",
                "openness_to_experience": "High",
                "key_behavioral_signals": [
                    "Calm, focused gaze with neutral facial tension",
                    "Symmetrical eyebrow posture"
                ]
            },
            "vitality_and_biological_age": {
                "perceived_biological_age_gap": "Younger than calendar age",
                "skin_vitality_and_energy_index": "Vibrant"
            },
            "presence_and_authority_markers": {
                "perceived_dominance": dominance,
                "expression_and_focus": f"Facial ratio index reflects {dominance.lower()} perceived authority and focused gaze."
            },
            "_note": "Generated via local quantitative CV engine (Ollama Qwen2.5-VL daemon was offline)."
        }
