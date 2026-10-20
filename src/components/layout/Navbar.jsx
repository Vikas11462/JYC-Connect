import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import Logo from './Logo'
import { NAV_LINKS } from '../../config/site'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const close = () => setOpen(false)
  const handleLogout = async () => {
    await logout()
    close()
    toast.info('Logged out successfully.')
    navigate('/')
  }

  const dashPath = user?.role === 'ADMIN' ? '/admin/dashboard'
    : user?.role === 'COORDINATOR' ? '/coordinator/dashboard'
    : '/dashboard'

  return (
    <>
      <div className="topstrip">
        <div className="container">
          <span>The campus community, connected.</span>
          <span>Jaypee University, Anoopshahr</span>
        </div>
      </div>
      <header className="navbar">
        <div className="container">
          <Link to="/" aria-label="JYC Connect home" onClick={close}><Logo /></Link>
          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            {user ? (
              <>
                <span className="badge badge-upcoming" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                  {user.role}
                </span>
                <Link to={dashPath} className="btn btn-secondary btn-sm"><LayoutDashboard size={15} /> Dashboard</Link>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}><LogOut size={15} /> Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>
          <button className="hamburger" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      <nav className={`mobile-menu${open ? ' open' : ''}`} aria-label="Mobile">
        {NAV_LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={close} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {l.label}
          </NavLink>
        ))}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          {user ? (
            <>
              <Link to={dashPath} className="btn btn-secondary" onClick={close}>My Activity</Link>
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" onClick={close}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={close}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}
