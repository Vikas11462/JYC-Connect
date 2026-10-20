import { useEffect, useState } from 'react'
import { Sparkles, Edit3, Check, Users, ExternalLink } from 'lucide-react'
import DemoNotice from '../../components/common/DemoNotice'
import Badge from '../../components/common/Badge'
import HubIcon from '../../components/hubs/HubIcon'
import { HUBS } from '../../data/mock'
import { api } from '../../services/api'
import { Link } from 'react-router-dom'

export default function AdminHubsPage() {
  const [hubs, setHubs] = useState(HUBS)
  const [editingSlug, setEditingSlug] = useState(null)
  const [editTagline, setEditTagline] = useState('')
  const [statusMessage, setStatusMessage] = useState(null)

  useEffect(() => {
    if (api.configured) {
      api.get('/api/hubs')
        .then(({ data }) => setHubs(data))
        .catch(() => {})
    }
  }, [])

  const startEdit = (hub) => {
    setEditingSlug(hub.slug)
    setEditTagline(hub.tagline)
  }

  const saveEdit = async (slug) => {
    if (api.configured) {
      try {
        await api.patch(`/api/hubs/${slug}`, { tagline: editTagline })
        setStatusMessage(`Hub ${slug} updated successfully.`)
      } catch (err) {
        setStatusMessage(`Error: ${err.message}`)
      }
    } else {
      setHubs((prev) =>
        prev.map((h) => (h.slug === slug ? { ...h, tagline: editTagline } : h))
      )
      setStatusMessage(`(Demo) Updated tagline for ${slug}.`)
    }
    setEditingSlug(null)
  }

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Hub Management</h1>
          <p className="section-sub">Configure and oversee all ten official youth hubs of Jaypee Youth Club.</p>
        </div>
      </div>

      <DemoNotice show={!api.configured} label="demo mode — hub metadata changes will persist to Neon/Postgres when backend is connected" />

      {statusMessage && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>
          {statusMessage}
        </div>
      )}

      <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
        {hubs.map((hub) => (
          <div key={hub.slug} className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius)',
                    background: hub.tint || '#eef2ff',
                    color: hub.color || '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <HubIcon name={hub.icon} size={22} color={hub.color} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--indigo-950)' }}>{hub.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-400)' }}>slug: /{hub.slug}</span>
                </div>
              </div>
              <Badge tone="upcoming">{hub.category}</Badge>
            </div>

            {editingSlug === hub.slug ? (
              <div style={{ marginTop: 'var(--space-3)' }}>
                <textarea
                  className="input"
                  rows={2}
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  style={{ fontSize: '0.88rem' }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => saveEdit(hub.slug)}>
                    <Check size={14} /> Save
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditingSlug(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-700)', margin: 'var(--space-3) 0' }}>
                {hub.tagline}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--line)', marginTop: 'var(--space-3)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={14} /> Official JYC Hub
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => startEdit(hub)}>
                  <Edit3 size={14} /> Edit
                </button>
                <Link to={`/hubs/${hub.slug}`} className="btn btn-outline btn-sm" target="_blank">
                  <ExternalLink size={14} /> View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
