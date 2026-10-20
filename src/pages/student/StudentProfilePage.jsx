import { useState } from 'react'
import FormField from '../../components/forms/FormField'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import DemoNotice from '../../components/common/DemoNotice'

export default function StudentProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [state, setState] = useState({ status: 'idle', message: '' })

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!api.configured) {
      setState({ status: 'error', message: 'Profile updates require the JYC backend API (VITE_API_BASE_URL).' })
      return
    }
    setState({ status: 'sending', message: '' })
    try {
      await api.patch('/api/me/profile', form)
      setState({ status: 'success', message: 'Profile updated.' })
    } catch (e) {
      setState({ status: 'error', message: e.message })
    }
  }

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.6rem' }}>My Profile</h1>
      <p className="section-sub">Manage your account details.</p>
      <DemoNotice show={!api.configured} />
      <form className="card" style={{ padding: 'var(--space-6)', maxWidth: 520 }} onSubmit={handleSubmit}>
        {state.status === 'success' && <div className="alert alert-success" role="status">{state.message}</div>}
        {state.status === 'error' && <div className="alert alert-error" role="alert">{state.message}</div>}
        <FormField label="Full name" htmlFor="p-name">
          <input id="p-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>
        <FormField label="Email" htmlFor="p-email" hint="Email cannot be changed here. Contact support for account issues.">
          <input id="p-email" className="input" type="email" value={form.email} disabled />
        </FormField>
        <button className="btn btn-primary" disabled={state.status === 'sending'}>
          {state.status === 'sending' ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
