export default function StatCard({ icon: Icon, value, label, tint = 'var(--violet-100)', color = 'var(--violet-600)' }) {
  return (
    <div className="card stat-card">
      <span className="hub-icon" style={{ '--hub-tint': tint, '--hub-color': color }} aria-hidden="true">
        <Icon size={21} />
      </span>
      <div>
        <b>{value}</b>
        <span>{label}</span>
      </div>
    </div>
  )
}
