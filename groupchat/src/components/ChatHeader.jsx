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
  badges: { display: 'flex', gap: 5, marginLeft: 'auto' },
}

const badge = (bg, color) => ({
  fontSize: 11, fontWeight: 500,
  padding: '3px 9px', borderRadius: 20,
  background: bg, color,
})

export default function ChatHeader() {
  return (
    <div style={styles.header}>
      <div style={styles.avatar}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--maya-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <div>
        <div style={styles.title}>Study group</div>
        <div style={styles.sub}>Maya, Leo, Sam</div>
      </div>
      <div style={styles.badges}>
        <span style={badge('var(--maya-bg)', 'var(--maya-text)')}>M</span>
        <span style={badge('var(--leo-bg)',  'var(--leo-text)')}>L</span>
        <span style={badge('var(--sam-bg)',  'var(--sam-text)')}>S</span>
      </div>
    </div>
  )
}
