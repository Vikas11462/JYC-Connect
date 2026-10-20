import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin, CheckCircle2, Share2, Building2, CalendarDays } from 'lucide-react'
import Badge from '../../components/common/Badge'
import DemoNotice from '../../components/common/DemoNotice'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorState from '../../components/common/ErrorState'
import EventPoster, { formatDate } from '../../components/events/EventPoster'
import EventCard, { registrationState } from '../../components/events/EventCard'
import { content } from '../../services/content'
import { EVENTS, hubBySlug } from '../../data/mock'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [result, setResult] = useState({ data: null, source: 'demo', error: null })
  const [registering, setRegistering] = useState(false)
  const [regState, setRegState] = useState({ status: 'idle', message: '' })

  const load = () => content.getEvent(id).then((r) => setResult({ ...r, data: r.data ?? undefined }))
  useEffect(() => { load() }, [id])

  const event = result.data
  const reg = event ? registrationState(event) : null
  const related = event
    ? EVENTS.filter((e) => e.id !== event.id && e.hub === event.hub).slice(0, 3)
    : []

  const handleRegister = async () => {
    if (!user) {
      toast.info('Please log in to register for events.')
      navigate('/login', { state: { from: `/events/${id}` } })
      return
    }
    setRegistering(true)
    setRegState({ status: 'idle', message: '' })
    try {
      await content.registerForEvent(id)
      setRegState({ status: 'success', message: 'You are registered for this event. See you there!' })
      toast.success('Successfully registered for this event! 🎉')
    } catch (e) {
      setRegState({ status: 'error', message: e.message })
      toast.error(e.message || 'Registration failed.')
    } finally {
      setRegistering(false)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: event?.title, url }) } catch { /* user cancelled */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      setRegState((s) => ({ ...s, message: s.message || 'Link copied to clipboard.' }))
      toast.info('Event link copied to clipboard! 📋')
    }
  }

  if (result.error && !result.data) return <ErrorState title="Event unavailable" message={result.error} onRetry={load} />
  if (!event) return <LoadingSpinner label="Loading event…" />

  const hub = hubBySlug(event.hub)

  return (
    <>
      <div className="page-head">
        <div className="container">
          <Link to="/events" className="link-arrow" style={{ marginBottom: 8, display: 'inline-flex' }}>
            <ArrowLeft size={15} /> Back to events
          </Link>
        </div>
      </div>
      <div className="container section" style={{ paddingTop: 'var(--space-6)' }}>
        <DemoNotice show={result.source === 'demo'} />
        <div className="detail-grid">
          <div>
            <EventPoster event={event} showDate={false} />
            <h2 style={{ marginTop: 'var(--space-6)' }}>About this event</h2>
            <p className="prose-block">{event.description}</p>
            {event.highlights?.length > 0 && (
              <>
                <h2>Event highlights</h2>
                <ul className="check-list">
                  {event.highlights.map((h) => (
                    <li key={h}><CheckCircle2 size={17} aria-hidden="true" />{h}</li>
                  ))}
                </ul>
              </>
            )}
            {event.organizer && (
              <>
                <h2 style={{ marginTop: 'var(--space-6)' }}>Organized by</h2>
                <div className="card" style={{ padding: 'var(--space-4)', display: 'flex', gap: 12, alignItems: 'center', maxWidth: 380 }}>
                  <span className="hub-icon" style={{ '--hub-color': hub?.color, '--hub-tint': hub?.tint }} aria-hidden="true">
                    <Building2 size={19} />
                  </span>
                  <div>
                    <strong style={{ color: 'var(--indigo-950)' }}>{event.organizer.name}</strong>
                    <div style={{ fontSize: '.8rem', color: 'var(--ink-500)' }}>{event.organizer.role}</div>
                  </div>
                </div>
              </>
            )}
          </div>
          <aside className="card info-panel" aria-label="Event details">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge tone="upcoming">{hub?.name || 'JYC'}</Badge>
              {event.type && <Badge tone="completed">{event.type}</Badge>}
              <Badge tone={reg.tone}>{reg.label}</Badge>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--indigo-950)', margin: 0 }}>{event.title}</h1>
            <div className="meta-row"><CalendarDays size={16} aria-hidden="true" />{formatDate(event.date)}</div>
            <div className="meta-row"><Clock size={16} aria-hidden="true" />{event.startTime} – {event.endTime}</div>
            <div className="meta-row"><MapPin size={16} aria-hidden="true" />{event.venue || 'Venue to be announced'}</div>
            {event.deadline && <div className="meta-row"><CheckCircle2 size={16} aria-hidden="true" />Registration deadline: {formatDate(event.deadline)}</div>}
            {typeof event.registered === 'number' && (
              <div className="meta-row"><UsersIcon />{event.registered}{event.capacity ? ` / ${event.capacity}` : ''} registered</div>
            )}

            {regState.status === 'success' && <div className="alert alert-success" role="status">{regState.message}</div>}
            {regState.status === 'error' && <div className="alert alert-error" role="alert">{regState.message}</div>}

            {reg.canRegister && (
              <button className="btn btn-primary btn-block" onClick={handleRegister} disabled={registering}>
                {registering ? 'Registering…' : user ? 'Register for this event' : 'Login to register'}
              </button>
            )}
            {!reg.canRegister && (
              <button className="btn btn-outline btn-block" disabled>{reg.label}</button>
            )}
            <button className="btn btn-outline btn-block" onClick={handleShare}><Share2 size={15} /> Share event</button>
          </aside>
        </div>

        {related.length > 0 && (
          <>
            <h2 style={{ marginTop: 'var(--space-7)' }}>More from {hub?.name}</h2>
            <div className="grid grid-3">
              {related.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </>
        )}
      </div>
    </>
  )
}

function UsersIcon() {
  return <CheckCircle2 size={16} aria-hidden="true" style={{ color: 'var(--violet-500)' }} />
}
