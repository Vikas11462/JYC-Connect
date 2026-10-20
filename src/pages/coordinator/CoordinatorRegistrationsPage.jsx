import { useEffect, useState } from 'react'
import { Download, Search, Users, Calendar, Filter } from 'lucide-react'
import DemoNotice from '../../components/common/DemoNotice'
import Badge from '../../components/common/Badge'
import { EVENTS } from '../../data/mock'
import { api } from '../../services/api'

const SAMPLE_REGS = [
  { id: 'reg-1', name: 'Aarav Gupta', email: 'student@jyc.ac.in', roll: '231B205', department: 'IT', event: 'Tech Fest 2026', eventId: 'ev-techfest-2026', status: 'CONFIRMED', date: '2026-10-18' },
  { id: 'reg-2', name: 'Sneha Patel', email: 'sneha.p@jyc.ac.in', roll: '231B210', department: 'CSE', event: 'Tech Fest 2026', eventId: 'ev-techfest-2026', status: 'CONFIRMED', date: '2026-10-18' },
  { id: 'reg-3', name: 'Kavita Singh', email: 'kavita.s@jyc.ac.in', roll: '241B045', department: 'Mechanical', event: 'Inter-Hub Sports Tournament 2026', eventId: 'ev-sports-2026', status: 'CONFIRMED', date: '2026-10-17' },
  { id: 'reg-4', name: 'Mohit Sharma', email: 'mohit.s@jyc.ac.in', roll: '231B180', department: 'ECE', event: 'Tech Fest 2026', eventId: 'ev-techfest-2026', status: 'CONFIRMED', date: '2026-10-16' },
  { id: 'reg-5', name: 'Riddhima Das', email: 'riddhima.d@jyc.ac.in', roll: '241B102', department: 'Civil', event: 'HackTheCampus 2026', eventId: 'ev-hackathon-2026', status: 'CONFIRMED', date: '2026-10-15' }
]

export default function CoordinatorRegistrationsPage() {
  const [registrations, setRegistrations] = useState(SAMPLE_REGS)
  const [search, setSearch] = useState('')
  const [selectedEvent, setSelectedEvent] = useState('ALL')

  useEffect(() => {
    if (api.configured && selectedEvent !== 'ALL') {
      api.get(`/api/events/${selectedEvent}/registrations`)
        .then(({ data }) => {
          if (Array.isArray(data)) {
            const mapped = data.map((r) => ({
              id: r.id,
              name: r.student?.name || 'Participant',
              email: r.student?.email || '—',
              roll: r.student?.rollNumber || '—',
              department: r.student?.department || '—',
              event: EVENTS.find((e) => e.id === selectedEvent)?.title || 'Event',
              eventId: selectedEvent,
              status: 'CONFIRMED',
              date: r.registeredAt ? r.registeredAt.split('T')[0] : 'Today'
            }))
            setRegistrations(mapped)
          }
        })
        .catch(() => {})
    }
  }, [selectedEvent])

  const filtered = registrations.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.roll.toLowerCase().includes(search.toLowerCase())
    const matchesEvent = selectedEvent === 'ALL' || r.eventId === selectedEvent || r.event === selectedEvent
    return matchesSearch && matchesEvent
  })

  const exportCSV = () => {
    const headers = ['Participant,Email,Roll Number,Department,Event,Status,Date']
    const rows = filtered.map((r) => `"${r.name}","${r.email}","${r.roll}","${r.department}","${r.event}","${r.status}","${r.date}"`)
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `jyc-registrations-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Event Registrations</h1>
          <p className="section-sub">Comprehensive participant roster for all events managed under your assigned hubs.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={exportCSV}>
          <Download size={15} /> Export Roster (CSV)
        </button>
      </div>

      <DemoNotice show={!api.configured} label="demo mode — participant lists reflect live Prisma registrations when backend is connected" />

      {/* Filter toolbar */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--ink-400)' }} />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by participant name, roll number, or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-500)', fontWeight: 600 }}>Event:</span>
            <select
              className="input"
              style={{ width: 'auto', minWidth: 200 }}
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="ALL">All Events ({registrations.length})</option>
              {EVENTS.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Roster Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Participant</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Registered Event</th>
                <th>Registered On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--ink-500)' }}>
                    No registrations found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div>
                        <strong>{r.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--ink-400)' }}>{r.email}</div>
                      </div>
                    </td>
                    <td>{r.roll}</td>
                    <td>{r.department}</td>
                    <td><strong>{r.event}</strong></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--ink-700)' }}>{r.date}</td>
                    <td>
                      <Badge tone={r.status === 'CONFIRMED' ? 'open' : 'closed'}>{r.status}</Badge>
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
