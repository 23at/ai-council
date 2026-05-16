import { useState } from 'react'

const styles = {
  overlay: {
    position: 'absolute', inset: 0,
    background: 'var(--bg-primary)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '14px', padding: '32px',
    borderRadius: '22px',
    zIndex: 50,
  },
  avatar: {
    width: 48, height: 48, borderRadius: '50%',
    background: 'var(--maya-bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  h3: { fontSize: 17, fontWeight: 500, color: 'var(--text-primary)' },
  p: { fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6 },
  input: {
    width: '100%', padding: '10px 14px',
    border: '0.5px solid var(--border-strong)',
    borderRadius: 8,
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 14, color: 'var(--text-primary)',
    background: 'var(--bg-secondary)', outline: 'none',
  },
  btn: {
    width: '100%', padding: '10px',
    borderRadius: 8,
    background: 'var(--user-bubble)', color: '#fff',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 14, fontWeight: 500,
    border: 'none', cursor: 'pointer',
  },
  note: { fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center' },
}

export default function SetupScreen({ onStart }) {
  const [key, setKey] = useState('')
  const [err, setErr] = useState('')

  function handleStart() {
    if (!key.startsWith('sk-')) { setErr('Enter a valid Anthropic API key (starts with sk-)'); return }
    setErr('')
    onStart(key)
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.avatar}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--maya-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <h3 style={styles.h3}>Study group</h3>
      <p style={styles.p}>Enter your Anthropic API key to start chatting with Maya, Leo, and Sam.</p>
      <input
        style={styles.input}
        type="password"
        placeholder="sk-ant-..."
        value={key}
        onChange={e => setKey(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleStart()}
        autoComplete="off"
      />
      {err && <p style={{ ...styles.note, color: 'var(--sam-text)' }}>{err}</p>}
      <button style={styles.btn} onClick={handleStart}>Start chatting</button>
      <span style={styles.note}>Key is stored in memory only — not saved anywhere.</span>
    </div>
  )
}
