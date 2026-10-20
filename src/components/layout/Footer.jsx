import { Link } from 'react-router-dom'
import { Mail, MapPin, Globe } from 'lucide-react'
import Logo from './Logo'
import { SITE, CONTACT, NAV_LINKS } from '../../config/site'
import { HUBS } from '../../data/mock'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <Logo light />
            <p style={{ fontSize: '.86rem', marginTop: 12, maxWidth: '32ch' }}>
              {SITE.tagline} The digital home of the {SITE.clubName}.
            </p>
          </div>
          <div>
            <h5>Quick Links</h5>
            {NAV_LINKS.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <div>
            <h5>JYC Hubs</h5>
            {HUBS.slice(0, 6).map((h) => <Link key={h.slug} to={`/hubs/${h.slug}`}>{h.name}</Link>)}
            <Link to="/hubs">All hubs →</Link>
          </div>
          <div>
            <h5>Contact</h5>
            {CONTACT.email && (
              <a href={`mailto:${CONTACT.email}`}><Mail size={13} style={{ verticalAlign: -2, marginRight: 6 }} />{CONTACT.email}</a>
            )}
            <span style={{ display: 'flex', gap: 8, fontSize: '.86rem', padding: '4px 0' }}>
              <MapPin size={14} style={{ flexShrink: 0, marginTop: 3 }} /> {CONTACT.address}
            </span>
            {CONTACT.socials.length > 0 && (
              <span style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                {CONTACT.socials.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} style={{ padding: 0 }}>
                    <Globe size={17} />
                  </a>
                ))}
              </span>
            )}
            {!CONTACT.email && (
              <p style={{ fontSize: '.76rem', color: 'rgba(255,255,255,.5)', marginTop: 8 }}>
                Official contact details will be published here once verified by JYC.
              </p>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>{SITE.copyright}</span>
          <span style={{ display: 'flex', gap: 18 }}>
            <Link to="/privacy" style={{ display: 'inline', padding: 0 }}>Privacy Policy</Link>
            <Link to="/terms" style={{ display: 'inline', padding: 0 }}>Terms of Use</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
