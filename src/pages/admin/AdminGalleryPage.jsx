import { useEffect, useState } from 'react'
import { Image, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import DemoNotice from '../../components/common/DemoNotice'
import Badge from '../../components/common/Badge'
import { GALLERY, GALLERY_FILTERS } from '../../data/mock'
import { api } from '../../services/api'

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState(GALLERY)
  const [activeFilter, setActiveFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Events')
  const [newUrl, setNewUrl] = useState('')
  const [isWide, setIsWide] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (api.configured) {
      api.get('/api/gallery')
        .then(({ data }) => setGallery(data))
        .catch(() => {})
    }
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTitle.trim() || !newUrl.trim()) return

    const payload = {
      title: newTitle.trim(),
      category: newCategory,
      imageUrl: newUrl.trim(),
      isWide,
      isTall: !isWide
    }

    if (api.configured) {
      try {
        const { data } = await api.post('/api/gallery', payload)
        setGallery([...gallery, data])
        setFeedback('Photo added to campus gallery.')
      } catch (err) {
        setFeedback(`Error: ${err.message}`)
      }
    } else {
      const demoItem = {
        id: `g-${Date.now()}`,
        title: newTitle,
        category: newCategory,
        imageUrl: newUrl,
        span: isWide ? 'wide' : '',
        tall: !isWide
      }
      setGallery([...gallery, demoItem])
      setFeedback('(Demo) Photo added locally.')
    }

    setNewTitle('')
    setNewUrl('')
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    if (api.configured) {
      try {
        await api.del(`/api/gallery/${id}`)
        setGallery(gallery.filter((g) => g.id !== id))
        setFeedback('Photo removed from gallery.')
      } catch (err) {
        setFeedback(`Error: ${err.message}`)
      }
    } else {
      setGallery(gallery.filter((g) => g.id !== id))
      setFeedback('(Demo) Photo removed.')
    }
  }

  const filtered = activeFilter === 'All'
    ? gallery
    : gallery.filter((g) => g.category?.toLowerCase() === activeFilter.toLowerCase())

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Gallery Content Management</h1>
          <p className="section-sub">Curate event photographs, cultural festival highlights, and campus life media.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> {showForm ? 'Close Form' : 'Add Photo'}
        </button>
      </div>

      <DemoNotice show={!api.configured} label="demo mode — photo additions will sync with object storage and Postgres when backend is live" />

      {feedback && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} /> {feedback}
        </div>
      )}

      {showForm && (
        <form className="card" onSubmit={handleAdd} style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
          <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: '1.1rem', color: 'var(--indigo-950)' }}>Add Gallery Photograph</h3>
          <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
            <div className="field">
              <label htmlFor="gal-title">Photo Title / Caption</label>
              <input
                id="gal-title"
                className="input"
                required
                placeholder="e.g. Hackathon Final Showcase"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="gal-cat">Category</label>
              <select id="gal-cat" className="input" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                {GALLERY_FILTERS.filter((f) => f !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="gal-url">Image URL (HTTPS link from object storage or CDN)</label>
            <input
              id="gal-url"
              className="input"
              required
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 'var(--space-4)' }}>
            <button type="submit" className="btn btn-primary">Add Photograph</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f}
            className="chip"
            aria-pressed={activeFilter === f}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-3" style={{ gap: 'var(--space-4)' }}>
        {filtered.map((item) => (
          <div key={item.id} className="card card-hover" style={{ overflow: 'hidden' }}>
            <div
              style={{
                height: 180,
                background: item.imageUrl ? `url('${item.imageUrl}') center/cover no-repeat` : 'var(--bg-soft)',
                position: 'relative'
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  background: 'rgba(16, 21, 63, 0.75)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                {item.category}
              </span>
            </div>
            <div style={{ padding: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--indigo-950)' }}>{item.title}</span>
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--danger)' }}
                onClick={() => handleDelete(item.id)}
                title="Remove photo"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
