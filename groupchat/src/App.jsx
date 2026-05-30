import { useState, useRef } from 'react'
import ChatHeader from './components/ChatHeader'
import MessageList from './components/MessageList'
import InputBar from './components/InputBar'
import { AGENT_IDS, AGENTS, sendMessage } from './lib/api'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function App() {
  const [agentNames, setAgentNames] = useState(() =>
    Object.fromEntries(AGENT_IDS.map(id => [id, AGENTS[id].defaultName]))
  )
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState([])
  const [busy, setBusy] = useState(false)
  const historyRef = useRef([])

  function addMsg(msg, { trackHistory = true } = {}) {
    const full = { ...msg, id: Date.now() + Math.random() }
    setMessages(prev => [...prev, full])
    if (trackHistory) {
      historyRef.current = [...historyRef.current, msg]
    }
  }

  function handleAgentNamesChange(nextNames) {
    const cleanNames = Object.fromEntries(
      AGENT_IDS.map(id => [id, nextNames[id]?.trim() || AGENTS[id].defaultName])
    )
    setAgentNames(cleanNames)
    const renameMessage = msg => (
      msg.agent_id && cleanNames[msg.agent_id]
        ? { ...msg, sender: cleanNames[msg.agent_id] }
        : msg
    )
    setMessages(prev => prev.map(renameMessage))
    historyRef.current = historyRef.current.map(renameMessage)
  }

async function handleSend(text) {
  if (!text.trim() || busy) return
  setBusy(true)
  addMsg({ sender: 'You', text, type: 'user' }, { trackHistory: false })

  try {
    const { new_messages, history } = await sendMessage(text, historyRef.current, agentNames)
    for (const msg of new_messages) {
      // show typing indicator briefly per message
      setTyping(prev => [...prev, msg.agent_id])
      await sleep(800 + Math.random() * 600)
      setTyping(prev => prev.filter(id => id !== msg.agent_id))
      addMsg({ ...msg, type: 'agent' }, { trackHistory: false })
    }
    historyRef.current = history
  } catch (e) {
    console.error('Chat error:', e)
  }
  setBusy(false)
}

  return (
    <div className="app-wrapper">
      <div className="chat-window">
        <ChatHeader agentNames={agentNames} onAgentNamesChange={handleAgentNamesChange} />
        <MessageList messages={messages} typing={typing} agentNames={agentNames} />
        <InputBar onSend={handleSend} disabled={busy} />
      </div>
    </div>
  )
}
