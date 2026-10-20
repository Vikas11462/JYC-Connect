import { Link } from 'react-router-dom'
import { Clock, MapPin } from 'lucide-react'
import EventPoster, { formatDate } from './EventPoster'
import Badge from '../common/Badge'
import { hubBySlug } from '../../data/mock'

export function registrationState(event) {
  if (event.status === 'cancelled') return { tone: 'cancelled', label: 'Cancelled', canRegister: false }
  if (event.status === 'completed') return { tone: 'completed', label: 'Completed', canRegister: false }
  if (!event.registrationsOpen) return { tone: 'closed', label: 'Registration closed', canRegister: false }
  if (event.capacity && event.registered >= event.capacity) return { tone: 'full', label: 'Fully booked', canRegister: false }
  return { tone: 'open', label: 'Registration open', canRegister: true }
}

export default function EventCard({ event }) {
  const hub = hubBySlug(event.hub)
  const reg = registrationState(event)
  return (
    <article className="card card-hover event-card">
      <Link to={`/events/${event.id}`} aria-label={`View details for ${event.title}`}>
        <EventPoster event={event} />
      </Link>
      <div className="event-body">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="upcoming">{hub?.name || 'JYC'}</Badge>
          <Badge tone={reg.tone}>{reg.label}</Badge>
        </div>
        <h3><Link to={`/events/${event.id}`}>{event.title}</Link></h3>
        <div className="meta-row"><Clock size={14} aria-hidden="true" />{formatDate(event.date)} · {event.startTime} – {event.endTime}</div>
        <div className="meta-row"><MapPin size={14} aria-hidden="true" />{event.venue || 'Venue to be announced'}</div>
        {event.description && <p className="event-desc">{event.description}</p>}
        <div className="event-actions">
          <Link to={`/events/${event.id}`} className="btn btn-outline btn-sm">View details</Link>
          {reg.canRegister && <Link to={`/events/${event.id}`} className="btn btn-primary btn-sm">Register now</Link>}
        </div>
      </div>
    </article>
  )
}
