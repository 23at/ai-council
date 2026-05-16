import { useState, useRef } from 'react'

export default function InputBar({ onSend, disabled }) {
  const [text, setText] = useState('')
  const ref = useRef(null)

  function handleSend() {
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('')
    if (ref.current) {
      ref.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput(e) {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 90) + 'px'
    setText(el.value)
  }

  return (
    <div style={{
      padding: '10px 12px 13px',
      borderTop: '0.5px solid var(--border)',
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'flex-end', gap: 8,
      flexShrink: 0,
    }}>
      <textarea
        ref={ref}
        value={text}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onChange={() => {}}
        placeholder="Message the group…"
        disabled={disabled}
        rows={1}
        style={{
          flex: 1, padding: '9px 14px',
          borderRadius: 20,
          border: '0.5px solid var(--border-strong)',
          background: 'var(--bg-secondary)',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 14, color: 'var(--text-primary)',
          resize: 'none', outline: 'none',
          lineHeight: 1.45, maxHeight: 90,
          transition: 'border-color 0.15s',
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="Send message"
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--user-bubble)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          flexShrink: 0,
          opacity: disabled || !text.trim() ? 0.35 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  )
}
