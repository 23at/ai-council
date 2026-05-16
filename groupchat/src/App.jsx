import { useState, useRef } from 'react'
import ChatHeader from './components/ChatHeader'
import MessageList from './components/MessageList'
import InputBar from './components/InputBar'
import {sendMessage} from './lib/api'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function App() {
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState([])
  const [busy, setBusy] = useState(false)
  const historyRef = useRef([])

  function addMsg(msg) {
    const full = { ...msg, id: Date.now() + Math.random() }
    setMessages(prev => [...prev, full])
    historyRef.current = [...historyRef.current, msg]
  }

async function handleSend(text) {
  if (!text.trim() || busy) return
  setBusy(true)
  addMsg({ sender: 'You', text, type: 'user' })

  try {
    const { new_messages } = await sendMessage(text, historyRef.current)
    for (const msg of new_messages) {
      // show typing indicator briefly per message
      setTyping(prev => [...prev, msg.sender])
      await sleep(800 + Math.random() * 600)
      setTyping(prev => prev.filter(n => n !== msg.sender))
      addMsg({ ...msg, type: 'agent' })
    }
  } catch (e) {
    console.error('Chat error:', e)
  }
  setBusy(false)
}

  return (
    <div className="app-wrapper">
      <div className="chat-window">
        <ChatHeader />
        <MessageList messages={messages} typing={typing} />
        <InputBar onSend={handleSend} disabled={busy} />
      </div>
    </div>
  )
}
