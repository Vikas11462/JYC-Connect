import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Megaphone, Compass, Trophy } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import EventCard from '../../components/events/EventCard'
import AnnouncementCard from '../../components/announcements/AnnouncementCard'
import EmptyState from '../../components/common/EmptyState'
import DemoNotice from '../../components/common/DemoNotice'
import { useAuth } from '../../context/AuthContext'
import { content } from '../../services/content'
import { EVENTS, ANNOUNCEMENTS } from '../../data/mock'

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [regs, setRegs] = useState({ data: [], source: 'demo' })
  useEffect(() => { content.myRegistrations().then(setRegs) }, [])

  const upcoming = EVENTS.filter((e) => e.status === 'upcoming').slice(0, 3)

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Welcome back, {user?.name?.split(' ')[0] || 'there'}!</h1>
      <p className="section-sub">Here's what's happening in your JYC community.</p>
      <DemoNotice show={regs.source === 'demo'} />

      <div className="grid grid-4" style={{ margin: 'var(--space-5) 0' }}>
        <StatCard icon={CalendarDays} value={regs.data.length} label="My registrations" />
        <StatCard icon={Compass} value="10" label="Hubs to explore" tint="var(--cyan-100)" color="var(--cyan-500)" />
        <StatCard icon={Trophy} value={EVENTS.filter((e) => e.status === 'upcoming').length} label="Upcoming events" tint="#fefce8" color="#ca8a04" />
        <StatCard icon={Megaphone} value={ANNOUNCEMENTS.length} label="Announcements" tint="#f0fdf4" color="#16a34a" />
      </div>

      <div className="section-head" style={{ marginTop: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--indigo-950)', margin: 0 }}>Upcoming events</h2>
        <Link to="/events" className="link-arrow">Explore all events</Link>
      </div>
      <div className="grid grid-3">
        {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
      </div>

      <div className="section-head" style={{ marginTop: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--indigo-950)', margin: 0 }}>Recent announcements</h2>
        <Link to="/dashboard/announcements" className="link-arrow">View all</Link>
      </div>
      <div className="grid grid-3">
        {ANNOUNCEMENTS.slice(0, 3).map((a) => <AnnouncementCard key={a.id} item={a} />)}
      </div>

      {regs.data.length === 0 && (
        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <EmptyState
            title="You haven't registered for any events yet"
            message="Explore upcoming events and register for the ones that interest you."
            action={<Link to="/events" className="btn btn-primary">Browse events</Link>}
          />
        </div>
      )}
    </div>
  )
}
