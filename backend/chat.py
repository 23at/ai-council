# chat.py
from dataclasses import dataclass, field

from agents import decide_who_responds, get_agent_reply
from models import ChatSession  

async def run_chat_turn(message: str, session: ChatSession) -> dict:
    session.history.append({ "sender": "User", "text": message })

    responders = await decide_who_responds(message, session)
    new_messages = []

    for i, name in enumerate(responders):
        reply = await get_agent_reply(name, message, session)
        session.history.append({ "sender": name, "text": reply })
        new_messages.append({ "sender": name, "text": reply })

    return {
        "new_messages": new_messages,
        "history": session.history,
    }