export default function EmptyState({ icon = '📭', title = 'Nothing here', description, action }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: '0 0 0.5rem 0' }}>
        {title}
      </p>
      {description && (
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 1rem 0' }}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
