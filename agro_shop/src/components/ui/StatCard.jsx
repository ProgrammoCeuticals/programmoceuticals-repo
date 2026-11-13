export default function StatCard({ value, label, variant, icon }) {
  return (
    <div className={`stat-card${variant ? ` ${variant}` : ''}`}>
      <div className="stat-val">
        {icon && <span style={{ marginRight: '0.3rem' }}>{icon}</span>}
        {value}
      </div>
      <div className="stat-lbl">{label}</div>
    </div>
  )
}
