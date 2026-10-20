import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Users, UserRound, Megaphone, Image, BarChart3, Trophy, LogOut, ClipboardCheck } from 'lucide-react'
import Logo from '../layout/Logo'
import { useAuth } from '../../context/AuthContext'

const NAVS = {
  STUDENT: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/my-events', label: 'My Events', icon: CalendarDays },
    { to: '/dashboard/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
  ],
  COORDINATOR: [
    { to: '/coordinator/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/coordinator/events', label: 'My Events', icon: CalendarDays },
    { to: '/coordinator/registrations', label: 'Registrations', icon: Users },
    { to: '/coordinator/attendance', label: 'Attendance', icon: ClipboardCheck },
    { to: '/coordinator/announcements', label: 'Announcements', icon: Megaphone },
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/events', label: 'Events', icon: CalendarDays },
    { to: '/admin/hubs', label: 'Hubs', icon: Trophy },
    { to: '/admin/users', label: 'Users & Roles', icon: Users },
    { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/admin/gallery', label: 'Gallery', icon: Image },
    { to: '/admin/team', label: 'Core Team', icon: UserRound },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ],
}

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = NAVS[role] || NAVS.STUDENT

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <Logo light />
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `dash-side-link${isActive ? ' active' : ''}`}>
            <l.icon size={17} /> {l.label}
          </NavLink>
        ))}
        <div style={{ marginTop: 'auto', display: 'grid', gap: 4 }}>
          <NavLink to="/" className="dash-side-link">← Back to website</NavLink>
          <button className="dash-side-link" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>
      <div className="dash-main">
        <nav className="dash-mobile-nav" aria-label="Dashboard">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `dash-side-link${isActive ? ' active' : ''}`}>
              <l.icon size={15} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="dash-topbar">
          <div>
            <strong style={{ color: 'var(--indigo-950)' }}>
              {role === 'ADMIN' ? 'Admin Portal' : role === 'COORDINATOR' ? 'Coordinator Portal' : 'My Activity'}
            </strong>
          </div>
          <div className="dash-user">
            <span className="avatar" aria-hidden="true">
              {user?.name ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?'}
            </span>
            <span>{user?.name || 'Student'}</span>
          </div>
        </div>
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
