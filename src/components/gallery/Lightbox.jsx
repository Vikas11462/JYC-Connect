import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const TINTS = [
  ['#4f46e5', '#1a2065'], ['#db2777', '#7c3aed'], ['#0891b2', '#1a2065'],
  ['#ea580c', '#db2777'], ['#16a34a', '#0891b2'], ['#9333ea', '#4f46e5'],
]

export default function Lightbox({ items, index, onClose, onNavigate }) {
  const prev = useCallback(() => onNavigate((index - 1 + items.length) % items.length), [index, items.length, onNavigate])
  const next = useCallback(() => onNavigate((index + 1) % items.length), [index, items.length, onNavigate])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  const item = items[index]
  const [a, b] = TINTS[index % TINTS.length]

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Photo viewer: ${item.title}`}>
      <button className="lb-btn lb-close" onClick={onClose} aria-label="Close viewer"><X size={20} /></button>
      <button className="lb-btn lb-prev" onClick={prev} aria-label="Previous photo"><ChevronLeft size={22} /></button>
      <div className="lightbox-inner">
        <div className="lightbox-visual" style={{ background: `linear-gradient(140deg, ${a}, ${b})` }}>
          <span>{item.title}</span>
        </div>
        <p>
          <strong>{item.title}</strong> · {item.category} · {index + 1} of {items.length}
          <br />
          <span style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)' }}>
            Placeholder visual — replace with an approved JYC photograph.
          </span>
        </p>
      </div>
      <button className="lb-btn lb-next" onClick={next} aria-label="Next photo"><ChevronRight size={22} /></button>
    </div>
  )
}
