import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, Shield, UserCheck, GraduationCap } from 'lucide-react'
import FormField from '../../components/forms/FormField'
import PasswordInput from '../../components/forms/PasswordInput'
import DemoNotice from '../../components/common/DemoNotice'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState({ status: 'idle', message: '' })

  const fillDemoRole = (email, password, roleName) => {
    setForm({ email, password })
    setErrors({})
    toast.info(`Filled credentials for ${roleName}`)
  }

  const validate = () => {
    const e = {}
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.password) e.password = 'Enter your password.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setState({ status: 'idle', message: '' })
    if (!validate()) return
    if (!api.configured) {
      setState({ status: 'error', message: 'Login requires the JYC backend API. Set VITE_API_BASE_URL in .env to enable authentication.' })
      return
    }
    setState({ status: 'sending', message: '' })
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name || 'member'}! (${user.role})`)
      const dest = user.role === 'ADMIN' ? '/admin/dashboard'
        : user.role === 'COORDINATOR' ? '/coordinator/dashboard'
        : from
      navigate(dest, { replace: true })
    } catch (e) {
      const msg = e.status === 401 ? 'Invalid email or password.' : e.message
      setState({ status: 'error', message: msg })
      toast.error(msg)
    }
  }

  return (
    <div className="auth-wrap">
      <aside className="auth-side">
        <span className="eyebrow" style={{ color: 'var(--cyan-100)' }}>
          <Sparkles size={14} /> JYC Connect Portal
        </span>
        <h2>Welcome back!</h2>
        <p>Log in to your account to continue your JYC journey — your events, registrations and announcements are waiting.</p>
        
        {/* Recruiter Quick Selector in Sidebar */}
        <div className="recruiter-pill-box">
          <div className="recruiter-box-header">
            <Sparkles size={15} style={{ color: 'var(--cyan-500)' }} />
            <span>Recruiter & Demo Mode (1-Click Fill)</span>
          </div>
          <p className="recruiter-box-sub">
            Click any role below to instantly load verified test credentials:
          </p>
          <div className="recruiter-buttons-grid">
            <button
              type="button"
              className="recruiter-btn"
              onClick={() => fillDemoRole('student@jyc.ac.in', 'Password@123', 'Student')}
            >
              <GraduationCap size={15} />
              <span>Student</span>
            </button>
            <button
              type="button"
              className="recruiter-btn"
              onClick={() => fillDemoRole('coordinator@jyc.ac.in', 'Password@123', 'AI Hub Coordinator')}
            >
              <UserCheck size={15} />
              <span>Coordinator</span>
            </button>
            <button
              type="button"
              className="recruiter-btn"
              onClick={() => fillDemoRole('admin@jyc.ac.in', 'Password@123', 'Admin')}
            >
              <Shield size={15} />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="auth-form-side">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h1>Login</h1>
          <p style={{ fontSize: '.88rem', color: 'var(--ink-500)' }}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <DemoNotice show={!api.configured} label="authentication disabled — backend not configured" />
          {state.status === 'error' && <div className="alert alert-error" role="alert">{state.message}</div>}

          <FormField label="Email address" htmlFor="l-email" error={errors.email}>
            <input id="l-email" className="input" type="email" autoComplete="email"
              placeholder="you@university.edu" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} />
          </FormField>
          <FormField label="Password" htmlFor="l-pass" error={errors.password}>
            <PasswordInput id="l-pass" value={form.password} autoComplete="current-password"
              placeholder="Enter your password" invalid={!!errors.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </FormField>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '.85rem', color: 'var(--ink-500)' }}>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--violet-600)' }}>Forgot password?</Link>
          </div>
          <button className="btn btn-primary btn-block" disabled={state.status === 'sending'}>
            {state.status === 'sending' ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
