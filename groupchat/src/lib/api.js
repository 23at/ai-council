const API_KEY = import.meta.env.API_KEY

export const AGENTS = {
  Maya: {
    initials: 'M',
    cls: 'maya',
    persona: `You are Maya in a student group chat. Sarcastic, emotionally intelligent, socially observant.
Text casually — lowercase, "ngl", "lol", "tbh" feel natural. You tease but are insightful.
Reply in 1-3 short sentences. No asterisks, no markdown, no quotes. Just raw chat text.`,
  },
  Leo: {
    initials: 'L',
    cls: 'leo',
    persona: `You are Leo in a student group chat. Optimistic, future-oriented, excited about ideas.
Text casually and enthusiastically. "omg", "honestly", "wait but" feel natural.
Reply in 1-3 short sentences. No asterisks, no markdown, no quotes. Just raw chat text.`,
  },
  Sam: {
    initials: 'S',
    cls: 'sam',
    persona: `You are Sam in a student group chat. Nihilistic yet hopeful, grounded in real student experience.
Dry deadpan humor. Sparse texting style, sometimes one-liner.
Reply in 1-3 short sentences. No asterisks, no markdown, no quotes. Just raw chat text.`,
  },
}

// src/lib/api.js

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'


export async function sendMessage(message, history) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return await res.json()  // { new_messages: [{sender, text}], history: [...] }
}