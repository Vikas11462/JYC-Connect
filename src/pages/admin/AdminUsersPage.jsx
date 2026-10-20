import { useEffect, useState } from 'react'
import { Users, Search, Shield, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react'
import DemoNotice from '../../components/common/DemoNotice'
import Badge from '../../components/common/Badge'
import { api } from '../../services/api'
import { HUBS } from '../../data/mock'

const INITIAL_USERS = [
  { id: 'usr-admin-1', name: 'JYC Administrator', email: 'admin@jyc.ac.in', rollNumber: 'FAC-ADMIN', role: 'ADMIN', department: 'Student Affairs', assignedHubs: ['All Hubs'] },
  { id: 'usr-coord-1', name: 'Rohan Verma', email: 'coordinator@jyc.ac.in', rollNumber: '221B101', role: 'COORDINATOR', department: 'Computer Science', assignedHubs: ['AI & Coding Hub'] },
  { id: 'usr-coord-2', name: 'Priya Sharma', email: 'sports.coord@jyc.ac.in', rollNumber: '221B102', role: 'COORDINATOR', department: 'Electronics', assignedHubs: ['Sports Hub'] },
  { id: 'usr-student-1', name: 'Aarav Gupta', email: 'student@jyc.ac.in', rollNumber: '231B205', role: 'STUDENT', department: 'Information Technology', assignedHubs: [] },
  { id: 'usr-student-2', name: 'Sneha Patel', email: 'sneha.p@jyc.ac.in', rollNumber: '231B210', role: 'STUDENT', department: 'Computer Science', assignedHubs: [] },
  { id: 'usr-student-3', name: 'Kavita Singh', email: 'kavita.s@jyc.ac.in', rollNumber: '241B045', role: 'STUDENT', department: 'Mechanical', assignedHubs: [] }
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUsers = () => {
    if (api.configured) {
      setLoading(true)
      const q = new URLSearchParams()
      if (search) q.set('search', search)
      if (roleFilter !== 'ALL') q.set('role', roleFilter)

      api.get(`/api/admin/users?${q.toString()}`)
        .then(({ data }) => setUsers(data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, roleFilter])

  const handleRoleChange = async (userId, newRole) => {
    setFeedback(null)
    if (api.configured) {
      try {
        await api.patch(`/api/admin/users/${userId}/role`, { role: newRole })
        setFeedback({ type: 'success', text: `Role updated to ${newRole} on server.` })
        fetchUsers()
      } catch (err) {
        setFeedback({ type: 'error', text: err.message || 'Failed to update role.' })
      }
    } else {
      // Local optimistic update
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
      setFeedback({ type: 'success', text: `(Demo) Role changed to ${newRole} for user.` })
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(search.toLowerCase()))
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.6rem' }}>User & Role Management</h1>
          <p className="section-sub">Govern member access, promote student coordinators, and audit administrative privileges.</p>
        </div>
      </div>

      <DemoNotice show={!api.configured} label="demo mode — role updates will persist directly to PostgreSQL when backend is connected" />

      {feedback && (
        <div
          className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}
          style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div className="grid grid-2" style={{ gap: 'var(--space-3)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--ink-400)' }} />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by student name, roll number, or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-500)', fontWeight: 600 }}>Role Filter:</span>
            <select
              className="input"
              style={{ width: 'auto', minWidth: 150 }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles ({users.length})</option>
              <option value="STUDENT">Students</option>
              <option value="COORDINATOR">Coordinators</option>
              <option value="ADMIN">Administrators</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Current Role</th>
                <th>Assigned Hub</th>
                <th>Role Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--ink-500)' }}>
                    No users found matching "{search}".
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div>
                        <strong>{u.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--ink-400)' }}>{u.email}</div>
                      </div>
                    </td>
                    <td>{u.rollNumber || '—'}</td>
                    <td>{u.department || 'Undergraduate'}</td>
                    <td>
                      <Badge tone={u.role === 'ADMIN' ? 'upcoming' : u.role === 'COORDINATOR' ? 'open' : 'completed'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--ink-700)' }}>
                      {u.assignedHubs && u.assignedHubs.length > 0 ? u.assignedHubs.join(', ') : 'None'}
                    </td>
                    <td>
                      <select
                        className="input"
                        style={{ padding: '4px 8px', fontSize: '0.82rem', width: 'auto' }}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="STUDENT">Student</option>
                        <option value="COORDINATOR">Coordinator</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
