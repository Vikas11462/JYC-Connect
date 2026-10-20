import { CalendarDays, Trophy, Users, ClipboardCheck } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import DemoNotice from '../../components/common/DemoNotice'
import Badge from '../../components/common/Badge'
import { EVENTS, HUBS } from '../../data/mock'

export default function AdminDashboardPage() {
  const upcoming = EVENTS.filter((e) => e.status === 'upcoming')
  const registrations = EVENTS.reduce((s, e) => s + (e.registered || 0), 0)
  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Admin Overview</h1>
      <p className="section-sub">Platform-wide overview. All figures below are demo values until the analytics API is connected.</p>
      <DemoNotice show />
      <div className="grid grid-4" style={{ margin: 'var(--space-5) 0' }}>
        <StatCard icon={CalendarDays} value={EVENTS.length} label="Published events" />
        <StatCard icon={Trophy} value={HUBS.length} label="Active hubs" tint="var(--cyan-100)" color="var(--cyan-500)" />
        <StatCard icon={Users} value={registrations} label="Registrations" tint="#f0fdf4" color="#16a34a" />
        <StatCard icon={ClipboardCheck} value="—" label="Attendance rate" tint="#fefce8" color="#ca8a04" />
      </div>
      <h2 style={{ fontSize: '1.2rem', color: 'var(--indigo-950)' }}>Upcoming events</h2>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Event</th><th>Hub</th><th>Date</th><th>Registered</th><th>Status</th></tr></thead>
          <tbody>
            {upcoming.map((e) => (
              <tr key={e.id}>
                <td><strong>{e.title}</strong></td>
                <td>{HUBS.find((h) => h.slug === e.hub)?.name}</td>
                <td>{e.date}</td>
                <td>{e.registered}{e.capacity ? ` / ${e.capacity}` : ''}</td>
                <td><Badge tone={e.registrationsOpen ? 'open' : 'closed'}>{e.registrationsOpen ? 'Open' : 'Closed'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
