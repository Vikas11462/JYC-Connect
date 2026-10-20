import { useState } from 'react'
import GalleryGrid from '../../components/gallery/GalleryGrid'
import DemoNotice from '../../components/common/DemoNotice'
import { GALLERY, GALLERY_FILTERS } from '../../data/mock'

export default function GalleryPage() {
  const [filter, setFilter] = useState('All')
  const items = GALLERY.filter((g) => filter === 'All' || g.category === filter)

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow">Gallery & updates</span>
          <h1>Life at JYC</h1>
          <p className="section-sub">Moments, memories, and milestones from across our campus community.</p>
        </div>
      </div>
      <div className="container section" style={{ paddingTop: 'var(--space-6)' }}>
        <DemoNotice show label="placeholder gallery visuals" />
        <div className="filter-bar">
          {GALLERY_FILTERS.map((f) => (
            <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <GalleryGrid items={items} />
      </div>
    </>
  )
}
