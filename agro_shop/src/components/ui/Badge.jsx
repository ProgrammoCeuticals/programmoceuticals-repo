const VARIANT_STYLES = {
  ok:     { background: '#c6f6d5', color: '#1c4532' },
  danger: { background: '#fed7d7', color: '#9b1c1c' },
  warn:   { background: '#fef3c7', color: '#78350f' },
  info:   { background: '#bee3f8', color: '#1a365d' },
}

export default function Badge({ children, variant = 'info' }) {
  const style = VARIANT_STYLES[variant] ?? VARIANT_STYLES.info
  return (
    <span
      style={{
        ...style,
        display: 'inline-block',
        padding: '2px 7px',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.3px',
      }}
    >
      {children}
    </span>
  )
}
