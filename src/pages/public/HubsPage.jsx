import { useState } from 'react'
import SearchBar from '../../components/common/SearchBar'
import HubCard from '../../components/hubs/HubCard'
import EmptyState from '../../components/common/EmptyState'
import { HUBS } from '../../data/mock'

const FILTERS = ['All', 'Creative', 'Technology', 'Community', 'Growth']

export default function HubsPage() {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')

  const hubs = HUBS.filter((h) => {
    const matchFilter = filter === 'All' || h.category === filter
    const q = query.trim().toLowerCase()
    const matchQuery = !q || h.name.toLowerCase().includes(q) || h.tagline.toLowerCase().includes(q)
    return matchFilter && matchQuery
  })

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow">Explore hubs</span>
          <h1>Discover Your Hub</h1>
          <p className="section-sub">Find your passion. Join a hub. Be part of something bigger.</p>
        </div>
      </div>
      <div className="container section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="filter-bar">
          <SearchBar value={query} onChange={setQuery} placeholder="Search hubs or interests…" label="Search hubs" />
          {FILTERS.map((f) => (
            <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        {hubs.length === 0 ? (
          <EmptyState title="No hubs match your search" message="Try a different keyword or category filter." />
        ) : (
          <div className="grid grid-3">
            {hubs.map((h) => <HubCard key={h.slug} hub={h} />)}
          </div>
        )}
      </div>
    </>
  )
}
