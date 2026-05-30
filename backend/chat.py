# chat.py
from dataclasses import dataclass, field

from agents import decide_who_responds, get_agent_display_names, get_agent_reply
from models import ChatSession  

async def run_chat_turn(message: str, session: ChatSession, agent_names: dict[str, str] | None = None) -> dict:
    display_names = get_agent_display_names(agent_names)
    session.history.append({ "sender": "User", "text": message })

    responders = await decide_who_responds(message, session, display_names)
    new_messages = []

    for i, name in enumerate(responders):
        reply = await get_agent_reply(name, message, session, display_names)
        sender = display_names[name]
        session.history.append({ "agent_id": name, "sender": sender, "text": reply })
        new_messages.append({ "agent_id": name, "sender": sender, "text": reply })

    return {
        "new_messages": new_messages,
        "history": session.history,
    }
