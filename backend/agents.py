import asyncio
import random
import re
import json
import os
from openai import AsyncOpenAI
from models import ChatSession

# ── Client ────────────────────────────────────────────────────────────────────

client = AsyncOpenAI(
    api_key=os.getenv("API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

semaphore = asyncio.Semaphore(2)

# ── Agents ────────────────────────────────────────────────────────────────────

AGENTS = {
    "Maya": {
        "model": "openai/gpt-4o-mini",
        "persona": """You are Maya in a student group chat. Sarcastic, emotionally intelligent, socially observant.
You speak casually like texting. You tease people sometimes but are insightful.
Reply in 1-3 short sentences. No asterisks, no markdown. Just raw chat text."""
    },
    "Leo": {
        "model": "openai/gpt-4o-mini",
        "persona": """You are Leo in a student group chat. Optimistic and future-oriented.
You text casually and enthusiastically. Focus on opportunities and creative possibilities.
Reply in 1-3 short sentences. No asterisks, no markdown. Just raw chat text."""
    },
    "Sam": {
        "model": "openai/gpt-4o-mini",
        "persona": """You are Sam in a student group chat. Nihilistic yet hopeful, grounded in real student experience.
Dry deadpan humor. Sparse texting style, sometimes a one-liner.
Reply in 1-3 short sentences. No asterisks, no markdown. Just raw chat text."""
    },
}

COORDINATOR_MODEL = "openai/gpt-4o-mini"

# ── Core model call ───────────────────────────────────────────────────────────

async def call_model(prompt: str, model: str, system: str = "") -> str:
    async with semaphore:
        try:
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            messages.append({"role": "user", "content": prompt})

            response = await client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=300,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print("Model error:", e)
            return f"Error: {str(e)}"

# ── Chat pipeline ─────────────────────────────────────────────────────────────

async def decide_who_responds(message: str, session: ChatSession) -> list[str]:
    history = session.format_history()

    prompt = f"""Group chat with Maya (sarcastic, witty), Leo (optimistic), Sam (nihilistic but hopeful).

Recent chat:
{history or '(just started)'}

User says: {message}

Who naturally replies? Consider: was someone addressed? Who has strong opinions here?
Sometimes only 1 replies, sometimes 2, rarely all 3.

Reply with ONLY a JSON array of names. Example: ["Maya"] or ["Leo","Sam"]"""

    try:
        raw = await call_model(
            prompt,
            COORDINATOR_MODEL,
            system='Reply ONLY with a valid JSON array of names from ["Maya","Leo","Sam"]. No explanation.'
        )
        match = re.search(r'\[.*?\]', raw, re.DOTALL)
        if match:
            names = json.loads(match.group())
            return [n for n in names if n in AGENTS][:3]
    except Exception as e:
        print("Coordinator error:", e)

    return [random.choice(list(AGENTS.keys()))]


async def get_agent_reply(name: str, message: str, session: ChatSession) -> str:
    history = session.format_history()

    prompt = f"""Recent group chat:
{history}

User just said: {message}

Reply naturally as {name}."""

    return await call_model(prompt, AGENTS[name]["model"], system=AGENTS[name]["persona"])


async def run_chat_turn(message: str, session: ChatSession) -> dict:
    session.history.append({"sender": "User", "text": message})

    responders = await decide_who_responds(message, session)
    new_messages = []

    for name in responders:
        reply = await get_agent_reply(name, message, session)
        session.history.append({"sender": name, "text": reply})
        new_messages.append({"sender": name, "text": reply})

    return {
        "new_messages": new_messages,
        "history": session.history,
    }

# ── Debate pipeline────────────────────────────────────

async def get_agent_answers(question: str) -> list[dict]:
    prompts = {
        name: f"{agent['persona']}\n\nQuestion:\n{question}\n\nAnswer thoughtfully in 2-3 sentences."
        for name, agent in AGENTS.items()
    }
    tasks = [call_model(prompts[name], AGENTS[name]["model"]) for name in AGENTS]
    answers = await asyncio.gather(*tasks)
    return [{"agent_id": name, "answer": ans} for name, ans in zip(AGENTS.keys(), answers)]


async def get_agent_critiques(question: str, answers: list[dict]) -> list[dict]:
    async def critique_agent(agent_name: str):
        others = [a for a in answers if a["agent_id"] != agent_name]
        tasks = [
            call_model(
                f"{AGENTS[agent_name]['persona']}\n\nQuestion:\n{question}\n\n{o['agent_id']} answered:\n{o['answer']}\n\nCritique in 1-2 sentences.",
                AGENTS[agent_name]["model"]
            )
            for o in others
        ]
        critiques = await asyncio.gather(*tasks)
        return {
            "agent_id": agent_name,
            "critiques": [{"target_agent": o["agent_id"], "critique": c} for o, c in zip(others, critiques)],
        }

    return await asyncio.gather(*[critique_agent(name) for name in AGENTS])


async def get_consensus(question: str, answers: list[dict], critiques: list[dict]) -> str:
    answers_text = "\n".join(f"{a['agent_id']}: {a['answer']}" for a in answers)
    critiques_text = "\n".join(
        f"{c['agent_id']} -> {r['target_agent']}: {r['critique']}"
        for c in critiques for r in c["critiques"]
    )
    prompt = f"Question: {question}\n\nAnswers:\n{answers_text}\n\nCritiques:\n{critiques_text}\n\nGive a final 3-4 sentence consensus answer."
    return await call_model(prompt, COORDINATOR_MODEL)


async def run_debate(question: str) -> dict:
    answers = await get_agent_answers(question)
    critiques = await get_agent_critiques(question, answers)
    consensus = await get_consensus(question, answers, critiques)
    return {
        "question": question,
        "agent_answers": answers,
        "agent_critiques": critiques,
        "consensus": consensus,
    }