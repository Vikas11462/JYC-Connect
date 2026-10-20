import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EventCard from '../../components/events/EventCard'
import EmptyState from '../../components/common/EmptyState'
import DemoNotice from '../../components/common/DemoNotice'
import { content } from '../../services/content'
import { EVENTS } from '../../data/mock'

export default function StudentEventsPage() {
  const [regs, setRegs] = useState({ data: [], source: 'demo' })
  useEffect(() => { content.myRegistrations().then(setRegs) }, [])

  // In demo mode there are no real registrations to display.
  const registeredEvents = regs.source === 'api'
    ? EVENTS.filter((e) => regs.data.some((r) => r.eventId === e.id || r.event?.id === e.id))
    : []

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.6rem' }}>My Events</h1>
      <p className="section-sub">Events you have registered for and your registration status.</p>
      <DemoNotice show={regs.source === 'demo'} label="demo mode — your real registrations appear once the backend is connected" />
      {registeredEvents.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No registrations yet"
            message="When you register for an event, it will show up here with its status."
            action={<Link to="/events" className="btn btn-primary">Find events</Link>}
          />
        </div>
      ) : (
        <div className="grid grid-3">
          {registeredEvents.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  )
}
