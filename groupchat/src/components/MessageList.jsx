import { useEffect, useRef } from 'react'
import { AGENTS } from '../lib/api'

function nowStr() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function Avatar({ name, ghost }) {
  if (ghost) return <div style={{ width: 26, height: 26, flexShrink: 0, visibility: 'hidden' }} />
  if (name === 'You') {
    return (
      <div style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        background: 'var(--user-bubble)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 500,
      }}>Y</div>
    )
  }
  const a = AGENTS[name]
  return (
    <div style={{
      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
      background: `var(--${a.cls}-bg)`, color: `var(--${a.cls}-text)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 500,
    }}>{a.initials}</div>
  )
}

function UserMessage({ msg }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 6 }}>
      <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'flex-end', gap: 7 }}>
        <Avatar name="You" />
        <div style={{
          maxWidth: '72%', padding: '9px 13px',
          background: 'var(--user-bubble)', color: '#fff',
          borderRadius: '20px 20px 4px 20px',
          fontSize: 14, lineHeight: 1.55, wordBreak: 'break-word',
        }}>{msg.text}</div>
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textAlign: 'right' }}>{nowStr()}</div>
    </div>
  )
}

function AgentMessage({ msg }) {
  const a = AGENTS[msg.sender]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 500, marginLeft: 33, marginBottom: 3, color: `var(--${a.cls}-text)` }}>
        {msg.sender}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7 }}>
        <Avatar name={msg.sender} />
        <div style={{
          maxWidth: '72%', padding: '9px 13px',
          background: 'var(--bg-primary)',
          border: '0.5px solid var(--border)',
          borderRadius: '20px 20px 20px 4px',
          fontSize: 14, lineHeight: 1.55,
          color: 'var(--text-primary)', wordBreak: 'break-word',
        }}>{msg.text}</div>
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginLeft: 33 }}>{nowStr()}</div>
    </div>
  )
}

function TypingIndicator({ name }) {
  const a = AGENTS[name]
  const dotStyle = (delay) => ({
    width: 5, height: 5, borderRadius: '50%',
    background: 'var(--text-tertiary)',
    animation: 'pulse 1.3s ease-in-out infinite',
    animationDelay: delay,
  })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0', marginBottom: 4 }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: `var(--${a.cls}-bg)`, color: `var(--${a.cls}-text)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 500, flexShrink: 0,
      }}>{a.initials}</div>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{name}</span>
      <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <span style={dotStyle('0s')} />
        <span style={dotStyle('0.18s')} />
        <span style={dotStyle('0.36s')} />
      </div>
    </div>
  )
}

export default function MessageList({ messages, typing }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      padding: '14px 12px',
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-secondary)',
      scrollbarWidth: 'thin',
      scrollbarColor: 'var(--border-strong) transparent',
    }}>
      <style>{`
        @keyframes pulse {
          0%, 60%, 100% { transform: scale(1); opacity: 0.45; }
          30% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>

      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', padding: '6px 0 10px' }}>
        Today
      </div>

      {messages.map(msg =>
        msg.type === 'user'
          ? <UserMessage key={msg.id} msg={msg} />
          : <AgentMessage key={msg.id} msg={msg} />
      )}

      {typing.map(name => <TypingIndicator key={name} name={name} />)}

      <div ref={bottomRef} />
    </div>
  )
}
