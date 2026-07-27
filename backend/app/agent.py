import json
import os
from typing import Dict, Any, List, TypedDict
from langgraph.graph import StateGraph, END
from app.logger import get_logger

logger = get_logger("VisageLangGraphAgent")

class AgentState(TypedDict):
    messages: List[Dict[str, str]]
    facial_metrics: Dict[str, Any]
    qualitative_profile: Dict[str, Any]
    recommendations: Dict[str, Any]
    visual_overlay: Dict[str, Any]
    session_id: str

class VisageStyleAgent:
    def __init__(self, model_name: str = None):
        self.model_name = model_name or os.getenv("OLLAMA_MODEL", "llava-phi3:latest")
        self.graph = self._build_graph()

    def _extract_intent_and_context(self, state: AgentState) -> AgentState:
        logger.info(f"[LangGraph Node: ExtractContext] Processing state for session: {state.get('session_id')}")
        return state

    def _query_style_rules(self, state: AgentState) -> AgentState:
        metrics = state.get("facial_metrics", {})
        fwhr = metrics.get("fwhr_ratio", 1.8)
        jaw_ratio = metrics.get("jaw_to_cheek_ratio", 0.78)
        symmetry = metrics.get("horizontal_symmetry_pct", 90.0)

        # Geometric Styling Rules Engine
        rule_book = []
        if fwhr >= 1.85:
            rule_book.append("High fWHR (Square/Broad structure): Recommend texturized medium length tops, soft side fades, and rounded/oval frame glasses to balance angularity.")
        else:
            rule_book.append("Standard/Oval fWHR: Recommend textured crop cuts, pompadours, and square or rectangle frame glasses to add definition.")

        if jaw_ratio >= 0.80:
            rule_book.append("Strong Mandibular Width: Short, well-manicured beard or clean stubble maintains jawline definition without adding volume.")
        else:
            rule_book.append("Tapered Jawline: Full, boxed beard or structured stubble adds lower face presence.")

        state["recommendations"] = {
            "geometric_rules": rule_book,
            "fwhr": fwhr,
            "jaw_ratio": jaw_ratio,
            "symmetry": symmetry
        }

        # Intent Detection for Virtual Try-On Overlays
        messages = state.get("messages", [])
        last_msg = messages[-1]["content"].lower() if messages else ""

        overlay_config = {
            "show_glasses": any(w in last_msg for w in ["glass", "frame", "aviator", "shade", "spectacle", "try-on", "try on"]),
            "show_haircut": any(w in last_msg for w in ["hair", "cut", "crop", "buzz", "fade", "pompadour"]),
            "show_beard": any(w in last_msg for w in ["beard", "stubble", "mustache", "grooming"]),
            "glasses_style": "aviator" if "aviator" in last_msg else ("round" if "round" in last_msg or fwhr >= 1.85 else "square"),
            "haircut_style": "buzz" if "buzz" in last_msg else ("crop" if "crop" in last_msg or fwhr >= 1.85 else "fade"),
            "beard_style": "stubble" if "stubble" in last_msg or jaw_ratio >= 0.80 else "full"
        }

        # Default to full try-on preview if user explicitly asks to try-on
        if "try-on" in last_msg or "try on" in last_msg or "show me" in last_msg or "preview" in last_msg:
            overlay_config["show_glasses"] = True
            overlay_config["show_haircut"] = True

        state["visual_overlay"] = overlay_config
        logger.info(f"[LangGraph Node: StyleRules] Applied rules & visual overlay config: {overlay_config}")
        return state

    def _generate_agent_response(self, state: AgentState) -> AgentState:
        import ollama

        messages = state.get("messages", [])
        rec_context = state.get("recommendations", {})
        qual_context = state.get("qualitative_profile", {})
        overlay_context = state.get("visual_overlay", {})

        system_prompt = f"""
        You are Visage IQ's Senior AI Grooming & Style Specialist.
        Answer the user's question directly, using their precise facial geometric data below:

        Facial Measurement Rules: {json.dumps(rec_context)}
        Qualitative Archetype Profile: {json.dumps(qual_context)}
        Active Visual Try-On Overlay: {json.dumps(overlay_context)}

        Give actionable, stylish, and personalized recommendations for haircuts, facial hair, glasses, or grooming. If a visual try-on overlay is active, confirm to the user that the canvas overlay preview is updated live on their photo. Keep your tone encouraging, professional, and concise.
        """

        try:
            logger.info(f"[LangGraph Node: LLMGenerator] Invoking Ollama LLM model '{self.model_name}'...")
            res = ollama.chat(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    *messages
                ]
            )
            response_text = res["message"]["content"].strip()
        except Exception as e:
            logger.warning(f"⚠️ LangGraph LLM generation warning ({e}). Using rule-based fallback response.")
            rules = rec_context.get("geometric_rules", ["Focus on balanced hair volume and clean frame lines."])
            response_text = f"Based on your facial ratios (fWHR {rec_context.get('fwhr', 1.8)} & Symmetry {rec_context.get('symmetry', 90)}%):\n\n" + "\n".join([f"• {r}" for r in rules])
            if overlay_context.get("show_glasses") or overlay_context.get("show_haircut"):
                response_text += "\n\n✨ Active Try-On Overlay preview updated live on your portrait HUD canvas!"

        state["messages"].append({"role": "assistant", "content": response_text})
        return state

    def _build_graph(self):
        workflow = StateGraph(AgentState)

        workflow.add_node("extract_context", self._extract_intent_and_context)
        workflow.add_node("style_rules", self._query_style_rules)
        workflow.add_node("generate_response", self._generate_agent_response)

        workflow.set_entry_point("extract_context")
        workflow.add_edge("extract_context", "style_rules")
        workflow.add_edge("style_rules", "generate_response")
        workflow.add_edge("generate_response", END)

        return workflow.compile()

    def run_chat_turn(self, session_id: str, user_message: str, facial_metrics: dict = None, qualitative_profile: dict = None, history: List[Dict[str, str]] = None) -> dict:
        input_history = history or []
        input_history.append({"role": "user", "content": user_message})

        initial_state: AgentState = {
            "messages": input_history,
            "facial_metrics": facial_metrics or {},
            "qualitative_profile": qualitative_profile or {},
            "recommendations": {},
            "visual_overlay": {},
            "session_id": session_id
        }

        final_state = self.graph.invoke(initial_state)
        return {
            "session_id": session_id,
            "messages": final_state["messages"],
            "latest_reply": final_state["messages"][-1]["content"],
            "visual_overlay": final_state.get("visual_overlay", {})
        }
