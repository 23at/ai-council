import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import DebateRequest
from agents import run_chat_turn, run_debate
from chat import run_chat_turn
from models import ChatSession

app = FastAPI(title="Multi-Agent Debate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",  "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok"}


# ── Debate mode (your original pipeline) ─────────────────────────────────────

class DebateRequest(BaseModel):
    question: str

@app.post("/debate")
async def debate(req: DebateRequest):
    return await run_debate(req.question)


# ── Chat mode (new conversational flow) ──────────────────────────────────────

sessions: dict[str, ChatSession] = {}

class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []
    agent_names: dict[str, str] = {}

@app.post("/chat")
async def chat(req: ChatRequest):
    session = ChatSession()
    session.history = req.history   # hydrate from frontend state
    return await run_chat_turn(req.message, session, req.agent_names)

@app.delete("/chat/{session_id}")
async def clear_session(session_id: str):
    sessions.pop(session_id, None)
    return { "cleared": session_id }


# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return { "status": "ok" }
