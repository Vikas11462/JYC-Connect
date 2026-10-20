const STYLES = {
  upcoming: 'badge badge-upcoming',
  open: 'badge badge-open',
  closed: 'badge badge-closed',
  full: 'badge badge-full',
  completed: 'badge badge-completed',
  cancelled: 'badge badge-cancelled',
  demo: 'badge badge-demo',
}

export default function Badge({ tone = 'upcoming', children }) {
  return <span className={STYLES[tone] || 'badge badge-upcoming'}>{children}</span>
}
