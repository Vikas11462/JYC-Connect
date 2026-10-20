import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, CalendarDays, Users } from 'lucide-react'
import SectionHeading from '../../components/common/SectionHeading'
import DemoNotice from '../../components/common/DemoNotice'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import EventCard from '../../components/events/EventCard'
import FeaturedEventCard from '../../components/events/FeaturedEventCard'
import { HubStripCard } from '../../components/hubs/HubCard'
import GalleryGrid from '../../components/gallery/GalleryGrid'
import TeamMemberCard from '../../components/team/TeamMemberCard'
import AnnouncementCard from '../../components/announcements/AnnouncementCard'
import { HUBS, GALLERY, TEAM } from '../../data/mock'
import { content } from '../../services/content'
import { SITE } from '../../config/site'

const isUpcoming = (e) => e.status === 'upcoming' && new Date(`${e.date}T23:59:59`) >= new Date()

export default function HomePage() {
  const [events, setEvents] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [demo, setDemo] = useState(false)

  useEffect(() => {
    content.listEvents().then((r) => { setEvents(r.data); setDemo(r.source === 'demo') })
    content.listAnnouncements().then((r) => setAnnouncements(r.data.slice(0, 3)))
  }, [])

  const upcoming = (events || []).filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date))
  const featured = upcoming[0]
  const rest = upcoming.slice(1, 4)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div>
            <span className="eyebrow"><Sparkles size={14} /> Your campus. Your community.</span>
            <h1>{SITE.heroHeadlineA}<br /><span className="accent">{SITE.heroHeadlineB}</span></h1>
            <p className="lead">
              Discover campus events, explore your interests, connect with student
              communities, and make your JYC journey count.
            </p>
            <div className="hero-cta">
              <Link to="/events" className="btn btn-primary">Explore Events <ArrowRight size={16} /></Link>
              <Link to="/hubs" className="btn btn-outline">Discover Hubs</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-frame">
              <div className="gallery-fill" style={{ background: 'linear-gradient(140deg, var(--indigo-800), var(--violet-600))', position: 'absolute', inset: 0 }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 900 }}>JYC Community</span>
              </div>
            </div>
            <div className="hero-badge" style={{ top: -16, right: 24 }}><Users size={16} /> One campus. Many possibilities.</div>
            <div className="hero-badge" style={{ bottom: -14, left: 24 }}><CalendarDays size={16} /> 10 hubs · 1 community</div>
          </div>
        </div>
      </section>

      {/* STATS — values only where real (hub count); placeholders otherwise */}
      <section className="stats-strip" aria-label="Community highlights">
        <div className="container">
          <div className="stat"><b>10</b><span>Hubs to explore</span></div>
          <div className="stat"><b>1</b><span>Connected community</span></div>
          <div className="stat"><b>∞</b><span>Opportunities to get involved</span></div>
          <div className="stat"><b>JYC</b><span>Make your campus life count</span></div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="section" id="events">
        <div className="container">
          <SectionHeading
            eyebrow="Upcoming"
            title="Upcoming Events"
            sub="Workshops, competitions, cultural fests and more — find what interests you."
            linkTo="/events" linkLabel="View all events"
          />
          <DemoNotice show={demo} />
          {!events && <LoadingSpinner label="Loading events…" />}
          {events && upcoming.length === 0 && (
            <EmptyState title="No upcoming events yet" message="New events will be published here soon. Check back later!" />
          )}
          {featured && (
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <FeaturedEventCard event={featured} />
            </div>
          )}
          {rest.length > 0 && (
            <div className="grid grid-3">
              {rest.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      </section>

      {/* HUBS STRIP */}
      <section className="section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="Explore hubs"
            title="Explore All JYC Hubs"
            sub="Find your passion. Join a hub. Be part of something bigger."
            linkTo="/hubs" linkLabel="Explore all hubs"
          />
          <div className="grid grid-5">
            {HUBS.map((h) => <HubStripCard key={h.slug} hub={h} />)}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Gallery & updates"
            title="Life at JYC"
            sub="Moments, memories, and milestones from across our campus community."
            linkTo="/gallery" linkLabel="View full gallery"
          />
          <GalleryGrid items={GALLERY.slice(0, 6)} />
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="section section-soft" id="about">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 'var(--space-7)' }}>
            <div>
              <span className="eyebrow">About JYC</span>
              <h2 className="section-title">Building a Stronger Campus Community</h2>
              <p className="prose-block">
                {SITE.clubName} is the student body that brings together hubs, events and
                opportunities to help every student grow, connect and create a lasting
                impact. Ten hubs cover culture, technology, sports, arts, business,
                media, social work and more — so there is a place here for everyone.
              </p>
              <Link to="/about" className="btn btn-primary">Learn more about JYC</Link>
            </div>
            <div className="hero-frame" style={{ aspectRatio: '16/10' }}>
              <div className="gallery-fill" style={{ background: 'linear-gradient(140deg, #0891b2, var(--indigo-900))', position: 'absolute', inset: 0 }}>
                <span style={{ fontWeight: 800 }}>Campus community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM PREVIEW */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Core team"
            title="Meet the JYC Core Team"
            sub="Student leaders and hub coordinators driving JYC forward."
            linkTo="/team" linkLabel="Meet the team"
          />
          <div className="grid grid-4">
            {TEAM.slice(0, 4).map((m) => <TeamMemberCard key={m.id} member={m} />)}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="section section-soft">
        <div className="container">
          <SectionHeading eyebrow="Latest updates" title="Announcements" />
          <div className="grid grid-3">
            {announcements.map((a) => <AnnouncementCard key={a.id} item={a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>Your next campus memory starts here.</h2>
            <p>Join events, meet your people, and make your time at JUA count.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link to="/events" className="btn btn-light">Explore Events</Link>
              <Link to="/register" className="btn btn-outline-light">Create Account</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
