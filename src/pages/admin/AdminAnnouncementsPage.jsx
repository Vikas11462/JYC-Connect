import { useEffect, useState } from 'react'
import { Megaphone, Plus, Trash2, Pin, CheckCircle2 } from 'lucide-react'
import DemoNotice from '../../components/common/DemoNotice'
import Badge from '../../components/common/Badge'
import { ANNOUNCEMENTS, HUBS } from '../../data/mock'
import { api } from '../../services/api'

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newText, setNewText] = useState('')
  const [newHub, setNewHub] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (api.configured) {
      api.get('/api/announcements')
        .then(({ data }) => setAnnouncements(data))
        .catch(() => {})
    }
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newTitle.trim() || !newText.trim()) return

    const payload = {
      title: newTitle.trim(),
      content: newText.trim(),
      hubId: newHub || null,
      isPinned
    }

    if (api.configured) {
      try {
        const { data } = await api.post('/api/announcements', payload)
        setAnnouncements([data, ...announcements])
        setFeedback('Announcement published to live platform.')
      } catch (err) {
        setFeedback(`Error: ${err.message}`)
      }
    } else {
      const demoItem = {
        id: `anc-${Date.now()}`,
        title: newTitle,
        text: newText,
        date: new Date().toISOString().split('T')[0],
        isPinned
      }
      setAnnouncements([demoItem, ...announcements])
      setFeedback('(Demo) Announcement added locally.')
    }

    setNewTitle('')
    setNewText('')
    setNewHub('')
    setIsPinned(false)
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    if (api.configured) {
      try {
        await api.del(`/api/announcements/${id}`)
        setAnnouncements(announcements.filter((a) => a.id !== id))
        setFeedback('Announcement deleted.')
      } catch (err) {
        setFeedback(`Error: ${err.message}`)
      }
    } else {
      setAnnouncements(announcements.filter((a) => a.id !== id))
      setFeedback('(Demo) Announcement removed.')
    }
  }

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Announcements Management</h1>
          <p className="section-sub">Publish official campus notices, registration alerts, and schedule changes.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> {showForm ? 'Close Form' : 'New Announcement'}
        </button>
      </div>

      <DemoNotice show={!api.configured} label="demo mode — announcements will persist via the live Express backend" />

      {feedback && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} /> {feedback}
        </div>
      )}

      {showForm && (
        <form className="card" onSubmit={handleCreate} style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
          <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: '1.1rem', color: 'var(--indigo-950)' }}>Create Official Announcement</h3>
          <div className="field">
            <label htmlFor="anc-title">Announcement Title</label>
            <input
              id="anc-title"
              className="input"
              required
              placeholder="e.g. Schedule update for Annual Sports Tournament"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="anc-content">Notice Content</label>
            <textarea
              id="anc-content"
              className="input"
              rows={3}
              required
              placeholder="Detailed notification message for student community…"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
          </div>
          <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
            <div className="field">
              <label htmlFor="anc-hub">Associated Hub (Optional)</label>
              <select id="anc-hub" className="input" value={newHub} onChange={(e) => setNewHub(e.target.value)}>
                <option value="">General University Notice (All Hubs)</option>
                {HUBS.map((h) => <option key={h.slug} value={h.slug}>{h.name}</option>)}
              </select>
            </div>
            <div className="field" style={{ justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 24 }}>
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--ink-700)' }}>Pin to top of student feed</span>
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 'var(--space-4)' }}>
            <button type="submit" className="btn btn-primary">Publish Announcement</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {announcements.map((anc) => (
          <div key={anc.id} className="card" style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {anc.isPinned && <Badge tone="open"><Pin size={12} /> Pinned</Badge>}
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-400)' }}>{anc.date || 'Recent'}</span>
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--indigo-950)' }}>{anc.title}</h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-700)' }}>{anc.text || anc.content}</p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--danger)' }}
              onClick={() => handleDelete(anc.id)}
              title="Delete announcement"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
