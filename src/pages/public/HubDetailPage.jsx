import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, UserRound, Mail, MapPin } from 'lucide-react'
import HubIcon from '../../components/hubs/HubIcon'
import EventCard from '../../components/events/EventCard'
import GalleryGrid from '../../components/gallery/GalleryGrid'
import DemoNotice from '../../components/common/DemoNotice'
import EmptyState from '../../components/common/EmptyState'
import Badge from '../../components/common/Badge'
import { hubBySlug, eventsForHub, GALLERY } from '../../data/mock'

const TABS = ['Upcoming Events', 'Gallery', 'Members']

export default function HubDetailPage() {
  const { slug } = useParams()
  const hub = hubBySlug(slug)
  const [tab, setTab] = useState(TABS[0])

  if (!hub) {
    return (
      <div className="container section">
        <EmptyState title="Hub not found" message="This hub does not exist or may have been removed."
          action={<Link to="/hubs" className="btn btn-primary">Browse all hubs</Link>} />
      </div>
    )
  }

  const events = eventsForHub(slug)

  return (
    <>
      <div className="container" style={{ paddingTop: 'var(--space-6)' }}>
        <Link to="/hubs" className="link-arrow" style={{ display: 'inline-flex', marginBottom: 12 }}>
          <ArrowLeft size={15} /> Back to hubs
        </Link>
      </div>
      <div className="container">
        <div className="card" style={{ padding: 'var(--space-7)', background: `linear-gradient(135deg, ${hub.color}18, #fff 60%)`, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--space-5)', alignItems: 'center' }}>
          <HubIcon hub={hub} size={34} />
          <div>
            <span className="eyebrow" style={{ color: hub.color }}>{hub.category} hub</span>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--indigo-950)', margin: 0 }}>{hub.name}</h1>
            <p style={{ color: 'var(--ink-500)', margin: '6px 0 0' }}>{hub.tagline}</p>
          </div>
        </div>
      </div>

      <div className="container section" style={{ paddingTop: 'var(--space-6)' }}>
        <DemoNotice show />
        <div className="pill-tabs" role="tablist" aria-label="Hub sections" style={{ marginBottom: 'var(--space-5)' }}>
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {tab === 'Upcoming Events' && (
          events.length ? (
            <div className="grid grid-3">{events.map((e) => <EventCard key={e.id} event={e} />)}</div>
          ) : (
            <EmptyState title="No published events yet" message={`Events hosted by the ${hub.name} will appear here once announced.`} />
          )
        )}

        {tab === 'Gallery' && <GalleryGrid items={GALLERY.slice(0, 6)} />}

        {tab === 'Members' && (
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div className="placeholder-banner">
              Coordinator and member details are published only after verification by JYC administration.
            </div>
            <div className="grid grid-3">
              {[
                { icon: UserRound, label: 'Coordinator', value: 'To be announced' },
                { icon: Mail, label: 'Contact', value: 'Available after verification' },
                { icon: MapPin, label: 'Location', value: 'Campus — room TBA' },
              ].map((m) => (
                <div key={m.label} className="card" style={{ padding: 'var(--space-4)', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span className="hub-icon" style={{ '--hub-color': hub.color, '--hub-tint': hub.tint }} aria-hidden="true"><m.icon size={18} /></span>
                  <div>
                    <Badge tone="demo">{m.label}</Badge>
                    <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--indigo-950)', marginTop: 4 }}>{m.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
