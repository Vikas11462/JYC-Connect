import { Link } from 'react-router-dom'
import { CalendarDays, Users, ClipboardCheck, Megaphone } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import EventCard from '../../components/events/EventCard'
import DemoNotice from '../../components/common/DemoNotice'
import { EVENTS } from '../../data/mock'
import { useAuth } from '../../context/AuthContext'

export default function CoordinatorDashboardPage() {
  const { user } = useAuth()
  const myEvents = EVENTS.slice(0, 3)
  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Coordinator Overview</h1>
      <p className="section-sub">Welcome, {user?.name || 'Coordinator'}. Manage your hub's events, registrations and attendance.</p>
      <DemoNotice show label="demo data — coordinator views reflect your assigned hub once the backend is connected" />
      <div className="grid grid-4" style={{ margin: 'var(--space-5) 0' }}>
        <StatCard icon={CalendarDays} value={myEvents.length} label="Events managed" />
        <StatCard icon={Users} value={myEvents.reduce((s, e) => s + (e.registered || 0), 0)} label="Total registrations" tint="var(--cyan-100)" color="var(--cyan-500)" />
        <StatCard icon={ClipboardCheck} value="—" label="Attendance marked" tint="#fefce8" color="#ca8a04" />
        <StatCard icon={Megaphone} value="—" label="Announcements" tint="#f0fdf4" color="#16a34a" />
      </div>
      <div className="section-head">
        <h2 style={{ fontSize: '1.2rem', color: 'var(--indigo-950)', margin: 0 }}>My events</h2>
        <Link to="/coordinator/events/new" className="btn btn-primary btn-sm">+ Create event</Link>
      </div>
      <div className="grid grid-3">
        {myEvents.map((e) => <EventCard key={e.id} event={e} />)}
      </div>
    </div>
  )
}
