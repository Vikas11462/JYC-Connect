import TeamMemberCard from '../../components/team/TeamMemberCard'
import DemoNotice from '../../components/common/DemoNotice'
import { TEAM } from '../../data/mock'

export default function TeamPage() {
  const gs = TEAM.filter((m) => m.role === 'G.S. Secretary')
  const office = TEAM.filter((m) => m.role === 'Office Bearer')
  const coords = TEAM.filter((m) => m.role === 'Hub Coordinator')

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow">Core team</span>
          <h1>Meet Our Core Team</h1>
          <p className="section-sub">The people behind JYC — organizing, creating, and making campus life memorable.</p>
        </div>
      </div>
      <div className="container section" style={{ paddingTop: 'var(--space-6)' }}>
        <DemoNotice show label="placeholder team profiles" />
        <div className="placeholder-banner">
          Names, photos and roles below are placeholders. Official profiles are published only
          after verification by the JYC administration.
        </div>

        <h2 className="section-title" style={{ fontSize: '1.4rem' }}>G.S. Secretary</h2>
        <div className="grid grid-4" style={{ marginBottom: 'var(--space-6)' }}>
          {gs.map((m) => <TeamMemberCard key={m.id} member={m} />)}
        </div>

        <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Office Bearers</h2>
        <div className="grid grid-4" style={{ marginBottom: 'var(--space-6)' }}>
          {office.map((m) => <TeamMemberCard key={m.id} member={m} />)}
        </div>

        <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Hub Coordinators</h2>
        <div className="grid grid-4">
          {coords.map((m) => <TeamMemberCard key={m.id} member={m} />)}
        </div>
      </div>
    </>
  )
}
