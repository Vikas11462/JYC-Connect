import { Link } from 'react-router-dom'
import { Target, Users, Eye, Star, HeartHandshake } from 'lucide-react'
import TeamMemberCard from '../../components/team/TeamMemberCard'
import SectionHeading from '../../components/common/SectionHeading'
import { TEAM, HUBS } from '../../data/mock'
import { SITE } from '../../config/site'

const VALUES = [
  { icon: Target, title: 'Our Mission', text: 'To empower students through leadership, creativity and service.' },
  { icon: HeartHandshake, title: 'Our Values', text: 'Integrity, collaboration, excellence and inclusivity.' },
  { icon: Eye, title: 'Our Vision', text: 'A vibrant campus community where everyone belongs.' },
  { icon: Star, title: 'Our Impact', text: 'More hubs. More opportunities. A stronger JYC.' },
]

export default function AboutPage() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow">About JYC</span>
          <h1>Building a Stronger Campus Community</h1>
          <p className="section-sub">{SITE.clubName} — empowering leaders, inspiring change.</p>
        </div>
      </div>

      <div className="container section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="grid grid-2" style={{ alignItems: 'center', gap: 'var(--space-7)' }}>
          <div className="hero-frame" style={{ aspectRatio: '16/10' }}>
            <div className="gallery-fill" style={{ background: 'linear-gradient(140deg, var(--indigo-800), #0891b2)', position: 'absolute', inset: 0 }}>
              <span style={{ fontWeight: 800 }}>Jaypee University campus</span>
            </div>
          </div>
          <div>
            <h2 className="section-title">What is JYC?</h2>
            <p className="prose-block">
              {SITE.clubName} (JYC) is the student community body of {SITE.university}. It exists
              so that every student can find their people, discover their passion, and turn
              ideas into action.
            </p>
            <p className="prose-block">
              Through its ten hubs, JYC runs cultural programs, technical workshops, sports
              tournaments, literary circles, media productions, social initiatives, business
              activities, tinkering projects and alumni engagement.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              <Link to="/hubs" className="btn btn-primary">Discover hubs</Link>
              <Link to="/events" className="btn btn-outline">Browse events</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="section section-soft">
        <div className="container">
          <SectionHeading eyebrow="What drives us" title="Mission, Values, Vision" />
          <div className="grid grid-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card" style={{ padding: 'var(--space-5)' }}>
                <span className="hub-icon" aria-hidden="true"><v.icon size={21} /></span>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--indigo-950)', marginTop: 10 }}>{v.title}</h3>
                <p style={{ fontSize: '.88rem', color: 'var(--ink-500)', margin: 0 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container section">
        <SectionHeading eyebrow="Get involved" title="Our Hubs" sub="Ten communities, one campus. There is a hub for every interest." linkTo="/hubs" linkLabel="Explore all hubs" />
        <div className="grid grid-5">
          {HUBS.map((h) => (
            <Link key={h.slug} to={`/hubs/${h.slug}`} className="card card-hover hub-strip-card">
              <span className="hub-icon" style={{ '--hub-color': h.color, '--hub-tint': h.tint, margin: '0 auto', width: 46, height: 46 }} aria-hidden="true">
                <Users size={19} style={{ display: 'none' }} />
              </span>
              <h4 style={{ fontSize: '.82rem', margin: 0, color: 'var(--indigo-950)' }}>{h.name}</h4>
            </Link>
          ))}
        </div>
      </div>

      <div className="section section-soft">
        <div className="container">
          <SectionHeading eyebrow="Core team" title="Meet the Core Team" linkTo="/team" linkLabel="Full team page" />
          <div className="grid grid-4">
            {TEAM.slice(0, 4).map((m) => <TeamMemberCard key={m.id} member={m} />)}
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="cta-band">
          <h2>Ready to find your people?</h2>
          <p>Browse events and hubs, create an account, and start participating today.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link to="/events" className="btn btn-light">Explore Events</Link>
            <Link to="/register" className="btn btn-outline-light">Create Account</Link>
          </div>
        </div>
      </div>
    </>
  )
}
