import DemoNotice from '../../components/common/DemoNotice'
import Badge from '../../components/common/Badge'
import { EVENTS, HUBS } from '../../data/mock'

export default function AdminEventsPage() {
  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Event Management</h1>
      <p className="section-sub">All events across every hub. Moderation actions require the Express admin API.</p>
      <DemoNotice show />
      <div className="table-wrap" style={{ marginTop: 'var(--space-5)' }}>
        <table className="data">
          <thead><tr><th>Event</th><th>Hub</th><th>Date</th><th>Registrations</th><th>Status</th></tr></thead>
          <tbody>
            {EVENTS.map((e) => (
              <tr key={e.id}>
                <td><strong>{e.title}</strong></td>
                <td>{HUBS.find((h) => h.slug === e.hub)?.name}</td>
                <td>{e.date}</td>
                <td>{e.registered}{e.capacity ? ` / ${e.capacity}` : ''}</td>
                <td><Badge tone={e.status === 'upcoming' ? 'upcoming' : 'completed'}>{e.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
