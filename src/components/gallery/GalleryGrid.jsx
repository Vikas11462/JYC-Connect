import { useState } from 'react'
import Lightbox from './Lightbox'

const TINTS = [
  ['#4f46e5', '#1a2065'], ['#db2777', '#7c3aed'], ['#0891b2', '#1a2065'],
  ['#ea580c', '#db2777'], ['#16a34a', '#0891b2'], ['#9333ea', '#4f46e5'],
]

export default function GalleryGrid({ items }) {
  const [active, setActive] = useState(null)

  return (
    <>
      <div className="gallery-grid" role="list">
        {items.map((g, i) => {
          const [a, b] = TINTS[i % TINTS.length]
          return (
            <button
              key={g.id}
              role="listitem"
              className={`gallery-item ${g.tall ? 'tall' : ''} ${g.span === 'wide' ? 'wide' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Open photo: ${g.title}`}
            >
              <span className="gallery-fill" style={{ background: `linear-gradient(140deg, ${a}, ${b})` }}>
                <span>{g.title}</span>
              </span>
              <span className="gallery-cap">{g.title} · Placeholder image — replace with an official JYC photo</span>
            </button>
          )
        })}
      </div>
      {active !== null && (
        <Lightbox items={items} index={active} onClose={() => setActive(null)} onNavigate={setActive} />
      )}
    </>
  )
}
