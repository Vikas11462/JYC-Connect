import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import FormField from '../../components/forms/FormField'
import DemoNotice from '../../components/common/DemoNotice'
import { HUBS, EVENTS } from '../../data/mock'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function CoordinatorEventFormPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const editing = EVENTS.find((e) => e.id === params.get('edit'))
  const { user } = useAuth()

  const [form, setForm] = useState({
    title: editing?.title || '', description: editing?.description || '',
    hub: editing?.hub || '', venue: editing?.venue || '',
    date: editing?.date || '', startTime: editing?.startTime || '',
    endTime: editing?.endTime || '', deadline: editing?.deadline || '',
    capacity: editing?.capacity || '', status: editing ? 'published' : 'draft',
  })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState({ status: 'idle', message: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const validate = () => {
    const er = {}
    if (form.title.trim().length < 3) er.title = 'Enter an event title.'
    if (!form.hub) er.hub = 'Select a hub.'
    if (!form.date) er.date = 'Select a date.'
    if (form.capacity && Number(form.capacity) < 1) er.capacity = 'Capacity must be at least 1.'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setState({ status: 'idle', message: '' })
    if (!validate()) return
    if (!api.configured) {
      setState({ status: 'error', message: 'Saving events requires the JYC backend API (VITE_API_BASE_URL).' })
      return
    }
    setState({ status: 'sending', message: '' })
    try {
      if (editing) await api.patch(`/api/coordinator/events/${editing.id}`, form)
      else await api.post('/api/coordinator/events', form)
      navigate('/coordinator/events')
    } catch (e) {
      setState({ status: 'error', message: e.message })
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 className="section-title" style={{ fontSize: '1.6rem' }}>{editing ? 'Edit Event' : 'Create Event'}</h1>
      <p className="section-sub">You can manage events only for hubs assigned to you by the administration.</p>
      <DemoNotice show={!api.configured} />
      <form className="card" style={{ padding: 'var(--space-6)' }} onSubmit={handleSubmit} noValidate>
        {state.status === 'error' && <div className="alert alert-error" role="alert">{state.message}</div>}
        <FormField label="Event title" htmlFor="e-title" error={errors.title}>
          <input id="e-title" className="input" value={form.title} onChange={set('title')} aria-invalid={!!errors.title} placeholder="e.g. Tech Fest 2026" />
        </FormField>
        <FormField label="Description" htmlFor="e-desc">
          <textarea id="e-desc" className="input" rows={4} value={form.description} onChange={set('description')} />
        </FormField>
        <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
          <FormField label="Hub" htmlFor="e-hub" error={errors.hub}>
            <select id="e-hub" className="input" value={form.hub} onChange={set('hub')} aria-invalid={!!errors.hub}>
              <option value="">Select hub…</option>
              {HUBS.map((h) => <option key={h.slug} value={h.slug}>{h.name}</option>)}
            </select>
          </FormField>
          <FormField label="Venue" htmlFor="e-venue">
            <input id="e-venue" className="input" value={form.venue} onChange={set('venue')} placeholder="e.g. Main Auditorium" />
          </FormField>
          <FormField label="Date" htmlFor="e-date" error={errors.date}>
            <input id="e-date" className="input" type="date" value={form.date} onChange={set('date')} aria-invalid={!!errors.date} />
          </FormField>
          <FormField label="Capacity" htmlFor="e-cap" error={errors.capacity}>
            <input id="e-cap" className="input" type="number" min="1" value={form.capacity} onChange={set('capacity')} aria-invalid={!!errors.capacity} />
          </FormField>
          <FormField label="Start time" htmlFor="e-start">
            <input id="e-start" className="input" value={form.startTime} onChange={set('startTime')} placeholder="10:00 AM" />
          </FormField>
          <FormField label="End time" htmlFor="e-end">
            <input id="e-end" className="input" value={form.endTime} onChange={set('endTime')} placeholder="5:00 PM" />
          </FormField>
          <FormField label="Registration deadline" htmlFor="e-deadline">
            <input id="e-deadline" className="input" type="date" value={form.deadline} onChange={set('deadline')} />
          </FormField>
          <FormField label="Publication status" htmlFor="e-status">
            <select id="e-status" className="input" value={form.status} onChange={set('status')}>
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published</option>
            </select>
          </FormField>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 'var(--space-4)' }}>
          <button className="btn btn-primary" disabled={state.status === 'sending'}>
            {state.status === 'sending' ? 'Saving…' : editing ? 'Save changes' : 'Create event'}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/coordinator/events')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
