import { useState } from 'react'
import AnnouncementCard from '../../components/announcements/AnnouncementCard'
import FormField from '../../components/forms/FormField'
import DemoNotice from '../../components/common/DemoNotice'
import { ANNOUNCEMENTS } from '../../data/mock'
import { api } from '../../services/api'

export default function CoordinatorAnnouncementsPage() {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [state, setState] = useState({ status: 'idle', message: '' })

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!api.configured) {
      setState({ status: 'error', message: 'Publishing announcements requires the JYC backend API (VITE_API_BASE_URL).' })
      return
    }
    setState({ status: 'sending', message: '' })
    try {
      await api.post('/api/coordinator/announcements', { title, text })
      setState({ status: 'success', message: 'Announcement published.' })
      setTitle(''); setText('')
    } catch (e) {
      setState({ status: 'error', message: e.message })
    }
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Announcements</h1>
      <p className="section-sub">Publish updates for your hub. Announcements may require admin approval before going live.</p>
      <DemoNotice show={!api.configured} />
      <form className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }} onSubmit={handleSubmit}>
        {state.status === 'success' && <div className="alert alert-success" role="status">{state.message}</div>}
        {state.status === 'error' && <div className="alert alert-error" role="alert">{state.message}</div>}
        <FormField label="Title" htmlFor="an-title">
          <input id="an-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormField>
        <FormField label="Message" htmlFor="an-text">
          <textarea id="an-text" className="input" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
        </FormField>
        <button className="btn btn-primary" disabled={state.status === 'sending' || !title.trim() || !text.trim()}>
          {state.status === 'sending' ? 'Publishing…' : 'Publish announcement'}
        </button>
      </form>
      <div className="grid" style={{ gap: 'var(--space-3)' }}>
        {ANNOUNCEMENTS.slice(0, 2).map((a) => <AnnouncementCard key={a.id} item={a} />)}
      </div>
    </div>
  )
}
