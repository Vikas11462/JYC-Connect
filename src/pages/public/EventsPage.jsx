import { useEffect, useMemo, useState } from 'react'
import SearchBar from '../../components/common/SearchBar'
import DemoNotice from '../../components/common/DemoNotice'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import EventCard from '../../components/events/EventCard'
import FeaturedEventCard from '../../components/events/FeaturedEventCard'
import { HUBS } from '../../data/mock'
import { content } from '../../services/content'

export default function EventsPage() {
  const [result, setResult] = useState({ data: null, source: 'demo', error: null })
  const [tab, setTab] = useState('upcoming')
  const [hub, setHub] = useState('all')
  const [query, setQuery] = useState('')

  const load = () => content.listEvents({ status: tab }).then(setResult)
  useEffect(() => { load() }, [tab])

  const events = useMemo(() => {
    let list = result.data || []
    const now = new Date()
    list = list.filter((e) =>
      tab === 'upcoming'
        ? e.status === 'upcoming' && new Date(`${e.date}T23:59:59`) >= now
        : e.status !== 'upcoming' || new Date(`${e.date}T23:59:59`) < now,
    )
    if (hub !== 'all') list = list.filter((e) => e.hub === hub)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((e) => e.title.toLowerCase().includes(q) || (e.category || '').toLowerCase().includes(q))
    }
    return list.sort((a, b) => b.date.localeCompare(a.date) * (tab === 'upcoming' ? -1 : 1))
  }, [result.data, tab, hub, query])

  const featured = tab === 'upcoming' ? events[0] : null
  const rest = featured ? events.slice(1) : events

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow">Events</span>
          <h1>Upcoming Events</h1>
          <p className="section-sub">Workshops, competitions, cultural fests and more — find what interests you.</p>
        </div>
      </div>
      <div className="container section" style={{ paddingTop: 'var(--space-6)' }}>
        <DemoNotice show={result.source === 'demo'} />
        {result.error && <ErrorState message={result.error} onRetry={load} />}
        <div className="filter-bar">
          <div className="pill-tabs" role="tablist" aria-label="Event period">
            <button role="tab" aria-selected={tab === 'upcoming'} onClick={() => setTab('upcoming')}>Upcoming</button>
            <button role="tab" aria-selected={tab === 'past'} onClick={() => setTab('past')}>Past</button>
          </div>
          <select className="input" style={{ maxWidth: 220 }} value={hub} onChange={(e) => setHub(e.target.value)} aria-label="Filter by hub">
            <option value="all">All hubs</option>
            {HUBS.map((h) => <option key={h.slug} value={h.slug}>{h.name}</option>)}
          </select>
          <SearchBar value={query} onChange={setQuery} placeholder="Search events…" label="Search events" />
        </div>

        {!result.data && <LoadingSpinner label="Loading events…" />}
        {result.data && events.length === 0 && (
          <EmptyState title="No events found" message="Try a different search or filter — new events are added regularly." />
        )}
        {featured && <div style={{ marginBottom: 'var(--space-5)' }}><FeaturedEventCard event={featured} /></div>}
        {rest.length > 0 && (
          <div className="grid grid-3">
            {rest.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </div>
    </>
  )
}
