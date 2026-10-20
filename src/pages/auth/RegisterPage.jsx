import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/forms/FormField'
import PasswordInput from '../../components/forms/PasswordInput'
import DemoNotice from '../../components/common/DemoNotice'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

function strength(pw) {
  if (!pw) return null
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return ['Weak', 'Fair', 'Good', 'Strong'][Math.min(s - 1, 3)] || 'Weak'
}

const STRENGTH_COLORS = { Weak: 'var(--danger)', Fair: 'var(--warning)', Good: 'var(--indigo-700)', Strong: 'var(--success)' }

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState({ status: 'idle', message: '' })
  const pwStrength = strength(form.password)

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Please enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid university email address.'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setState({ status: 'idle', message: '' })
    if (!validate()) return
    if (!api.configured) {
      setState({ status: 'error', message: 'Registration requires the JYC backend API. Set VITE_API_BASE_URL in .env to enable account creation.' })
      return
    }
    setState({ status: 'sending', message: '' })
    try {
      // Role is always STUDENT — admin/coordinator roles are assigned via protected admin workflows.
      await register({ name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password, role: 'STUDENT' })
      setState({ status: 'success', message: 'Account created! You can log in now.' })
      setTimeout(() => navigate('/login'), 1200)
    } catch (e) {
      setState({ status: 'error', message: e.message })
    }
  }

  return (
    <div className="auth-wrap">
      <aside className="auth-side">
        <span className="eyebrow" style={{ color: 'var(--cyan-100)' }}>Join JYC Connect</span>
        <h2>Create your account</h2>
        <p>Create your account and be part of the campus community — register for events, follow your hubs, and never miss an announcement.</p>
      </aside>
      <div className="auth-form-side">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h1>Create Account</h1>
          <p style={{ fontSize: '.88rem', color: 'var(--ink-500)' }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <DemoNotice show={!api.configured} label="registration disabled — backend not configured" />
          {state.status === 'success' && <div className="alert alert-success" role="status">{state.message}</div>}
          {state.status === 'error' && <div className="alert alert-error" role="alert">{state.message}</div>}
          <FormField label="Full name" htmlFor="r-name" error={errors.name}>
            <input id="r-name" className="input" autoComplete="name" placeholder="Your full name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} />
          </FormField>
          <FormField label="Email address" htmlFor="r-email" error={errors.email} hint="Use your university email if you have one.">
            <input id="r-email" className="input" type="email" autoComplete="email" placeholder="you@university.edu"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} />
          </FormField>
          <FormField label="Password" htmlFor="r-pass" error={errors.password}
            hint={pwStrength ? `Strength: ${pwStrength}` : 'At least 8 characters.'}>
            <PasswordInput id="r-pass" value={form.password} autoComplete="new-password" placeholder="Create a password"
              invalid={!!errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {pwStrength && (
              <span className="hint" style={{ color: STRENGTH_COLORS[pwStrength], fontWeight: 700 }}>Strength: {pwStrength}</span>
            )}
          </FormField>
          <FormField label="Confirm password" htmlFor="r-confirm" error={errors.confirm}>
            <PasswordInput id="r-confirm" value={form.confirm} autoComplete="new-password" placeholder="Confirm your password"
              invalid={!!errors.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </FormField>
          <button className="btn btn-primary btn-block" disabled={state.status === 'sending'}>
            {state.status === 'sending' ? 'Creating account…' : 'Register'}
          </button>
          <p className="auth-alt" style={{ fontSize: '.76rem', marginTop: 12 }}>
            By registering you agree to the JYC Connect Terms of Use and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  )
}
