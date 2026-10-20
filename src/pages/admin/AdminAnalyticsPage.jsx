import { useEffect, useState } from 'react'
import { Users, Calendar, Award, CheckCircle, TrendingUp, BarChart3, ShieldCheck } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import DemoNotice from '../../components/common/DemoNotice'
import { api } from '../../services/api'
import { HUBS } from '../../data/mock'

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (api.configured) {
      api.get('/api/admin/analytics')
        .then(({ data }) => setAnalytics(data))
        .catch(() => setAnalytics(null))
        .finally(() => setLoading(false))
    } else {
      // High-fidelity fallback for demo viewing
      setAnalytics({
        totals: {
          totalUsers: 1420,
          totalStudents: 1380,
          totalCoordinators: 24,
          totalEvents: 18,
          activeEvents: 8,
          totalRegistrations: 780,
          totalAttendanceMarked: 520
        },
        hubStats: HUBS.map((h, i) => ({
          id: h.slug,
          name: h.name,
          slug: h.slug,
          eventsCount: 2 + (i % 3),
          registrationsCount: 80 + (i * 18)
        }))
      })
      setLoading(false)
    }
  }, [])

  const totals = analytics?.totals || {}
  const hubStats = analytics?.hubStats || []

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Platform Analytics & Insights</h1>
          <p className="section-sub">Real-time participation metrics, hub performance, and registration volume.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="badge badge-open">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span>
            Live Telemetry
          </span>
        </div>
      </div>

      <DemoNotice show={!api.configured} label="demo mode — connect backend API to stream real-time database aggregations" />

      {/* KPI Cards */}
      <div className="grid grid-4" style={{ margin: 'var(--space-5) 0', gap: 'var(--space-4)' }}>
        <StatCard icon={Users} value={totals.totalStudents || 0} label="Active Students" tint="#eff6ff" color="#2563eb" />
        <StatCard icon={Calendar} value={totals.activeEvents || 0} label="Upcoming Events" tint="#fdf4ff" color="#c026d3" />
        <StatCard icon={Award} value={totals.totalRegistrations || 0} label="Total Registrations" tint="#f0fdf4" color="#16a34a" />
        <StatCard icon={CheckCircle} value={totals.totalAttendanceMarked || 0} label="Attendance Verified" tint="#fefce8" color="#ca8a04" />
      </div>

      {/* Hub Participation Breakdown Table */}
      <div className="card" style={{ padding: 'var(--space-5)', marginTop: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={20} color="var(--indigo-800)" />
            <h2 style={{ fontSize: '1.15rem', color: 'var(--indigo-950)', margin: 0 }}>Hub Participation & Engagement</h2>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--ink-500)' }}>10 Official JYC Hubs</span>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Hub Name</th>
                <th>Category</th>
                <th>Events Hosted</th>
                <th>Registrations</th>
                <th>Engagement Bar</th>
              </tr>
            </thead>
            <tbody>
              {hubStats.map((stat) => {
                const maxRegs = Math.max(...hubStats.map((s) => s.registrationsCount || 1))
                const pct = Math.min(100, Math.round(((stat.registrationsCount || 0) / maxRegs) * 100))
                const hubMeta = HUBS.find((h) => h.slug === stat.slug)

                return (
                  <tr key={stat.id || stat.slug}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: hubMeta?.color || '#4f46e5' }}></span>
                        <strong>{stat.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-upcoming">{hubMeta?.category || 'General'}</span>
                    </td>
                    <td>{stat.eventsCount}</td>
                    <td><strong>{stat.registrationsCount}</strong> students</td>
                    <td style={{ minWidth: 160 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 8, background: 'var(--bg-soft)', borderRadius: 999, overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: hubMeta?.color || 'var(--indigo-800)',
                              borderRadius: 999,
                              transition: 'width 0.4s ease'
                            }}
                          ></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--ink-500)', width: 32 }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
