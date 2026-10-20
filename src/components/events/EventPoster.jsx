import { hubBySlug } from '../../data/mock'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDate(dateStr) {
  if (!dateStr) return 'Date TBA'
  const d = new Date(`${dateStr}T00:00:00`)
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export default function EventPoster({ event, showDate = true, className = '' }) {
  const hub = hubBySlug(event.hub)
  const day = event.date ? new Date(`${event.date}T00:00:00`).getDate() : null
  const month = event.date ? MONTHS[new Date(`${event.date}T00:00:00`).getMonth()] : null
  return (
    <div className={`event-poster ${className}`} style={{ background: `linear-gradient(140deg, ${hub?.color || '#4f46e5'} 0%, var(--indigo-900) 90%)` }}>
      <div className="poster-fill">
        {event.poster
          ? <img src={event.poster} alt={`${event.title} poster`} loading="lazy" />
          : <h4>{event.title}</h4>}
      </div>
      {showDate && day && (
        <div className="date-block" aria-hidden="true">
          <b>{day}</b><span>{month}</span>
        </div>
      )}
    </div>
  )
}
