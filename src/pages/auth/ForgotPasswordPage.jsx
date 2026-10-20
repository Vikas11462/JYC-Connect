import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../../components/forms/FormField'
import DemoNotice from '../../components/common/DemoNotice'
import { api } from '../../services/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [state, setState] = useState({ status: 'idle', message: '' })

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setError(''); setState({ status: 'idle', message: '' })
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a valid email address.'); return }
    if (!api.configured) {
      setState({ status: 'error', message: 'Password recovery requires the JYC backend API. It has not been configured yet.' })
      return
    }
    setState({ status: 'sending', message: '' })
    try {
      await api.post('/api/auth/forgot-password', { email })
      // Generic message — never reveal whether the account exists.
      setState({ status: 'success', message: 'If an account exists for this email, a reset link has been sent.' })
    } catch (e) {
      setState({ status: 'error', message: e.message })
    }
  }

  return (
    <div className="auth-wrap">
      <aside className="auth-side">
        <h2>Reset your password</h2>
        <p>Enter the email associated with your account and we'll send you a reset link.</p>
      </aside>
      <div className="auth-form-side">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h1>Forgot password</h1>
          <p style={{ fontSize: '.88rem', color: 'var(--ink-500)' }}>Remembered it? <Link to="/login">Back to login</Link></p>
          <DemoNotice show={!api.configured} label="password recovery disabled — backend not configured" />
          {state.status === 'success' && <div className="alert alert-success" role="status">{state.message}</div>}
          {state.status === 'error' && <div className="alert alert-error" role="alert">{state.message}</div>}
          <FormField label="Email address" htmlFor="f-email" error={error}>
            <input id="f-email" className="input" type="email" placeholder="you@university.edu"
              value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} />
          </FormField>
          <button className="btn btn-primary btn-block" disabled={state.status === 'sending'}>
            {state.status === 'sending' ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  )
}
