import { useEffect, useState } from 'react'
import DemoNotice from '../../components/common/DemoNotice'
import Badge from '../../components/common/Badge'
import { EVENTS } from '../../data/mock'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { CheckCircle2, UserCheck, XCircle } from 'lucide-react'

const DEFAULT_ATTENDEES = [
  { id: 'reg-1', name: 'Aarav Gupta', roll: '231B205', department: 'IT', present: true },
  { id: 'reg-2', name: 'Sneha Patel', roll: '231B210', department: 'CSE', present: null },
  { id: 'reg-3', name: 'Kavita Singh', roll: '241B045', department: 'Mechanical', present: null },
  { id: 'reg-4', name: 'Mohit Sharma', roll: '231B180', department: 'ECE', present: false }
]

export default function CoordinatorAttendancePage() {
  const { user } = useAuth()
  const toast = useToast()
  const [selectedEventId, setSelectedEventId] = useState(EVENTS[0]?.id || '')
  const [rows, setRows] = useState(DEFAULT_ATTENDEES)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (api.configured && selectedEventId) {
      api.get(`/api/events/${selectedEventId}/registrations`)
        .then(({ data }) => {
          if (Array.isArray(data) && data.length > 0) {
            setRows(
              data.map((r) => ({
                id: r.id,
                name: r.student?.name || 'Student',
                roll: r.student?.rollNumber || '—',
                department: r.student?.department || '—',
                present: r.attendance === 'PRESENT' ? true : r.attendance === 'ABSENT' ? false : null
              }))
            )
          }
        })
        .catch(() => {})
    }
  }, [selectedEventId])

  const markStatus = (id, status) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, present: status } : r)))
    setSaved(false)
  }

  const markAll = (status) => {
    setRows((rs) => rs.map((r) => ({ ...r, present: status })))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    if (api.configured) {
      try {
        const batch = rows
          .filter((r) => r.present !== null)
          .map((r) => ({
            registrationId: r.id,
            status: r.present ? 'PRESENT' : 'ABSENT'
          }))
        await api.post(`/api/attendance/${selectedEventId}/mark`, { batch })
        setSaved(true)
        toast.success(`Saved attendance for ${batch.length} attendees!`)
      } catch (err) {
        toast.error(`Failed to save: ${err.message}`)
      } finally {
        setSaving(false)
      }
    } else {
      setTimeout(() => {
        setSaved(true)
        setSaving(false)
        toast.success(`Saved attendance records (Demo Mode)`)
      }, 300)
    }
  }

  const presentCount = rows.filter((r) => r.present === true).length
  const absentCount = rows.filter((r) => r.present === false).length

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Attendance Management</h1>
          <p className="section-sub">Verify participant attendance for authorized hub events and generate records.</p>
        </div>
      </div>

      <DemoNotice show={!api.configured} label="demo mode — marked attendance records will persist to PostgreSQL when backend is connected" />

      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} /> Attendance records successfully updated.
        </div>
      )}

      {/* Event Selector & Stats */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div className="grid grid-2" style={{ gap: 'var(--space-4)', alignItems: 'center' }}>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="att-event" style={{ fontWeight: 600 }}>Select Event to Mark Attendance</label>
            <select
              id="att-event"
              className="input"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              {EVENTS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} ({e.date}) — {e.registered} registered
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-500)' }}>Roster Progress</div>
              <div style={{ fontWeight: 700, color: 'var(--indigo-950)' }}>
                {presentCount} Present / {absentCount} Absent / {rows.length} Total
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Attendance'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Batch Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-3)' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => markAll(true)}>
          <UserCheck size={14} /> Mark All Present
        </button>
        <button className="btn btn-outline btn-sm" onClick={() => markAll(false)}>
          <XCircle size={14} /> Mark All Absent
        </button>
      </div>

      {/* Attendance Roster Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Participant</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Attendance Status</th>
                <th>Verification Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.roll}</td>
                  <td>{r.department}</td>
                  <td>
                    {r.present === true && <Badge tone="open">Present</Badge>}
                    {r.present === false && <Badge tone="full">Absent</Badge>}
                    {r.present === null && <Badge tone="completed">Unmarked</Badge>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className={`btn btn-sm ${r.present === true ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => markStatus(r.id, true)}
                      >
                        Present
                      </button>
                      <button
                        className={`btn btn-sm ${r.present === false ? 'btn-danger' : 'btn-outline'}`}
                        onClick={() => markStatus(r.id, false)}
                      >
                        Absent
                      </button>
                    </div>
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
