import { useEffect, useState } from 'react'
import { Users, Plus, Trash2, CheckCircle2, Award } from 'lucide-react'
import DemoNotice from '../../components/common/DemoNotice'
import Badge from '../../components/common/Badge'
import { TEAM, HUBS } from '../../data/mock'
import { api } from '../../services/api'

export default function AdminTeamPage() {
  const [team, setTeam] = useState(TEAM)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('Hub Coordinator')
  const [hubName, setHubName] = useState('')
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (api.configured) {
      api.get('/api/team')
        .then(({ data }) => setTeam(data))
        .catch(() => {})
    }
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    const payload = {
      name: name.trim(),
      role,
      hubName: hubName || null,
      isCore: role.includes('Secretary') || role.includes('Advisor')
    }

    if (api.configured) {
      try {
        const { data } = await api.post('/api/team', payload)
        setTeam([...team, data])
        setFeedback('Team member added to official leadership directory.')
      } catch (err) {
        setFeedback(`Error: ${err.message}`)
      }
    } else {
      const demoMember = {
        id: `tm-${Date.now()}`,
        name,
        role,
        hub: hubName || null,
        placeholder: false
      }
      setTeam([...team, demoMember])
      setFeedback('(Demo) Member added locally.')
    }

    setName('')
    setHubName('')
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    if (api.configured) {
      try {
        await api.del(`/api/team/${id}`)
        setTeam(team.filter((t) => t.id !== id))
        setFeedback('Team member removed.')
      } catch (err) {
        setFeedback(`Error: ${err.message}`)
      }
    } else {
      setTeam(team.filter((t) => t.id !== id))
      setFeedback('(Demo) Member removed.')
    }
  }

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Leadership & Team Management</h1>
          <p className="section-sub">Govern official student council officers, faculty advisors, and hub coordinators.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> {showForm ? 'Close Form' : 'Add Team Member'}
        </button>
      </div>

      <DemoNotice show={!api.configured} label="demo mode — official verified member details will synchronize with PostgreSQL" />

      {feedback && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} /> {feedback}
        </div>
      )}

      {showForm && (
        <form className="card" onSubmit={handleAdd} style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
          <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: '1.1rem', color: 'var(--indigo-950)' }}>Add Team Member</h3>
          <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
            <div className="field">
              <label htmlFor="tm-name">Full Name</label>
              <input
                id="tm-name"
                className="input"
                required
                placeholder="e.g. Vikramaditya Rao"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="tm-role">Designation / Role</label>
              <select id="tm-role" className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="General Secretary (G.S.)">General Secretary (G.S.)</option>
                <option value="Joint Secretary">Joint Secretary</option>
                <option value="Hub Coordinator">Hub Coordinator</option>
                <option value="Faculty Advisor">Faculty Advisor</option>
                <option value="Office Bearer">Office Bearer</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="tm-hub">Assigned Hub (if Coordinator)</label>
              <select id="tm-hub" className="input" value={hubName} onChange={(e) => setHubName(e.target.value)}>
                <option value="">None / Executive Council</option>
                {HUBS.map((h) => <option key={h.name} value={h.name}>{h.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 'var(--space-4)' }}>
            <button type="submit" className="btn btn-primary">Save Member</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Designation</th>
                <th>Hub Affiliation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'var(--violet-100)',
                          color: 'var(--violet-600)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        {m.name.charAt(0)}
                      </div>
                      <strong>{m.name}</strong>
                    </div>
                  </td>
                  <td>
                    <Badge tone={m.role.includes('Secretary') ? 'open' : 'upcoming'}>{m.role}</Badge>
                  </td>
                  <td>{m.hub || m.hubName || 'Executive Council'}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => handleDelete(m.id)}
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
