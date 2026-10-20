import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import FormField from '../../components/forms/FormField'
import { CONTACT } from '../../config/site'
import { api } from '../../services/api'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState({ status: 'idle', message: '' })

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address.'
    if (form.message.trim().length < 10) e.message = 'Message should be at least 10 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setState({ status: 'idle', message: '' })
    if (!validate()) return
    if (!api.configured) {
      setState({ status: 'error', message: 'The contact form requires the JYC backend API (VITE_API_BASE_URL). It has not been configured yet.' })
      return
    }
    setState({ status: 'sending', message: '' })
    try {
      await api.post('/api/contact', form)
      setState({ status: 'success', message: 'Thanks! Your message has been sent to the JYC team.' })
      setForm({ name: '', email: '', message: '' })
    } catch (e) {
      setState({ status: 'error', message: e.message })
    }
  }

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>Get in Touch</h1>
          <p className="section-sub">Have questions about JYC, an event, or a hub? Reach out to us.</p>
        </div>
      </div>
      <div className="container section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="grid grid-2" style={{ gap: 'var(--space-6)', alignItems: 'start' }}>
          <div className="grid" style={{ gap: 'var(--space-4)' }}>
            <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', gap: 14, alignItems: 'center' }}>
              <span className="hub-icon" aria-hidden="true"><Mail size={19} /></span>
              <div>
                <strong style={{ color: 'var(--indigo-950)' }}>Email</strong>
                <div style={{ fontSize: '.86rem', color: 'var(--ink-500)' }}>{CONTACT.email || 'To be published once officially verified'}</div>
              </div>
            </div>
            <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', gap: 14, alignItems: 'center' }}>
              <span className="hub-icon" aria-hidden="true"><Phone size={19} /></span>
              <div>
                <strong style={{ color: 'var(--indigo-950)' }}>Phone</strong>
                <div style={{ fontSize: '.86rem', color: 'var(--ink-500)' }}>{CONTACT.phone || 'To be published once officially verified'}</div>
              </div>
            </div>
            <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', gap: 14, alignItems: 'center' }}>
              <span className="hub-icon" aria-hidden="true"><MapPin size={19} /></span>
              <div>
                <strong style={{ color: 'var(--indigo-950)' }}>Location</strong>
                <div style={{ fontSize: '.86rem', color: 'var(--ink-500)' }}>{CONTACT.address}</div>
              </div>
            </div>
          </div>

          <form className="card" style={{ padding: 'var(--space-6)' }} onSubmit={handleSubmit} noValidate>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--indigo-950)' }}>Send us a message</h2>
            {state.status === 'success' && <div className="alert alert-success" role="status">{state.message}</div>}
            {state.status === 'error' && <div className="alert alert-error" role="alert">{state.message}</div>}
            <FormField label="Full name" htmlFor="c-name" error={errors.name}>
              <input id="c-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} />
            </FormField>
            <FormField label="Email" htmlFor="c-email" error={errors.email}>
              <input id="c-email" className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} />
            </FormField>
            <FormField label="Message" htmlFor="c-msg" error={errors.message}>
              <textarea id="c-msg" className="input" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-invalid={!!errors.message} />
            </FormField>
            <button className="btn btn-primary btn-block" disabled={state.status === 'sending'}>
              <Send size={15} /> {state.status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
