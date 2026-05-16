# backend/models.py
# Pydantic models define the "shape" of data going in and out of your API.
# FastAPI uses these to:
#   1. Automatically validate incoming requests (wrong type = clear error message)
#   2. Serialize outgoing responses to JSON
#   3. Auto-generate API docs at localhost:8000/docs

from pydantic import BaseModel
from typing import List

from dataclasses import dataclass, field

@dataclass
class ChatSession:
    history: list[dict] = field(default_factory=list)

    def format_history(self, limit=8) -> str:
        return "\n".join(
            f"{m['sender']}: {m['text']}"
            for m in self.history[-limit:]
        )
# ---------------------------------------------------------------------------
# Request models (what the frontend sends TO the backend)
# ---------------------------------------------------------------------------

class DebateRequest(BaseModel):
    question: str  # e.g. "What is the best programming language?"


# ---------------------------------------------------------------------------
# Response models (what the backend sends BACK to the frontend)
# These nest inside each other to match the shape of our data.
# ---------------------------------------------------------------------------

class AgentAnswer(BaseModel):
    agent_id: str   # "Agent A", "Agent B", "Agent C"
    answer: str     # their response to the question


class SingleCritique(BaseModel):
    target_agent: str  # who is being critiqued
    critique: str      # the critique text


class AgentCritique(BaseModel):
    agent_id: str                    # who wrote these critiques
    critiques: List[SingleCritique]  # one critique per other agent


class DebateResponse(BaseModel):
    question: str
    agent_answers: List[AgentAnswer]
    agent_critiques: List[AgentCritique]
    consensus: str