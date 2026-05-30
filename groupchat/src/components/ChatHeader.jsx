import { useState } from 'react'
import { AGENT_IDS, AGENTS, getInitials } from '../lib/api'

const styles = {
  header: {
    padding: '14px 16px 12px',
    borderBottom: '0.5px solid var(--border)',
    background: 'var(--bg-primary)',
    display: 'flex', alignItems: 'center', gap: 10,
    flexShrink: 0,
  },
  avatar: {
    width: 38, height: 38, borderRadius: '50%',
    background: 'var(--maya-bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  title: { fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' },
  sub: { fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 },
  headerText: { minWidth: 0 },
  badges: { display: 'flex', gap: 5, marginLeft: 'auto', alignItems: 'center' },
  namesButton: {
    border: '0.5px solid var(--border-strong)',
    borderRadius: 8,
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 12,
    padding: '5px 8px',
    cursor: 'pointer',
  },
  editor: {
    borderTop: '0.5px solid var(--border)',
    background: 'var(--bg-primary)',
    padding: '10px 12px 12px',
    display: 'grid',
    gap: 8,
    flexShrink: 0,
  },
  field: {
    display: 'grid',
    gridTemplateColumns: '42px 1fr',
    alignItems: 'center',
    gap: 8,
  },
  label: { fontSize: 12, color: 'var(--text-secondary)' },
  input: {
    minWidth: 0,
    width: '100%',
    border: '0.5px solid var(--border-strong)',
    borderRadius: 8,
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 13,
    padding: '8px 10px',
    outline: 'none',
  },
}

const badge = (bg, color) => ({
  fontSize: 11, fontWeight: 500,
  padding: '3px 9px', borderRadius: 20,
  background: bg, color,
})

export default function ChatHeader({ agentNames, onAgentNamesChange }) {
  const [editing, setEditing] = useState(false)
  const [draftNames, setDraftNames] = useState(agentNames)

  function openEditor() {
    setDraftNames(agentNames)
    setEditing(true)
  }

  function saveNames() {
    onAgentNamesChange(draftNames)
    setEditing(false)
  }

  return (
    <>
      <div style={styles.header}>
        <div style={styles.avatar}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--maya-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div style={styles.headerText}>
          <div style={styles.title}>Study group</div>
          <div style={styles.sub}>{AGENT_IDS.map(id => agentNames[id]).join(', ')}</div>
        </div>
        <div style={styles.badges}>
          {AGENT_IDS.map(id => {
            const agent = AGENTS[id]
            return (
              <span key={id} style={badge(`var(--${agent.cls}-bg)`, `var(--${agent.cls}-text)`)}>
                {getInitials(agentNames[id])}
              </span>
            )
          })}
          <button style={styles.namesButton} type="button" onClick={editing ? saveNames : openEditor}>
            {editing ? 'Save' : 'Names'}
          </button>
        </div>
      </div>
      {editing && (
        <div style={styles.editor}>
          {AGENT_IDS.map(id => (
            <label key={id} style={styles.field}>
              <span style={styles.label}>{AGENTS[id].defaultName}</span>
              <input
                style={styles.input}
                type="text"
                maxLength={24}
                value={draftNames[id] ?? ''}
                onChange={e => setDraftNames(prev => ({ ...prev, [id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && saveNames()}
              />
            </label>
          ))}
        </div>
      )}
    </>
  )
}
