import { Link } from 'react-router-dom'
import { Clock, MapPin, ArrowRight } from 'lucide-react'
import EventPoster, { formatDate } from './EventPoster'
import Badge from '../common/Badge'
import { hubBySlug } from '../../data/mock'
import { registrationState } from './EventCard'

export default function FeaturedEventCard({ event }) {
  const hub = hubBySlug(event.hub)
  const reg = registrationState(event)
  return (
    <article className="card featured-event">
      <Link to={`/events/${event.id}`} aria-label={`View details for ${event.title}`}>
        <EventPoster event={event} className="event-poster" />
      </Link>
      <div className="featured-body">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="upcoming">Featured</Badge>
          <Badge tone="upcoming">{hub?.name || 'JYC'}</Badge>
          <Badge tone={reg.tone}>{reg.label}</Badge>
        </div>
        <h3>{event.title}</h3>
        <div className="meta-row"><Clock size={15} aria-hidden="true" />{formatDate(event.date)} · {event.startTime} – {event.endTime}</div>
        <div className="meta-row"><MapPin size={15} aria-hidden="true" />{event.venue || 'Venue to be announced'}</div>
        <p style={{ color: 'var(--ink-500)' }}>{event.description}</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          <Link to={`/events/${event.id}`} className="btn btn-primary">
            {reg.canRegister ? 'Register for event' : 'View details'} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}
