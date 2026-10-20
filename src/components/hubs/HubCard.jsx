import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import HubIcon from './HubIcon'

export default function HubCard({ hub }) {
  return (
    <Link to={`/hubs/${hub.slug}`} className="card card-hover hub-card" aria-label={`Explore ${hub.name}`}>
      <HubIcon hub={hub} />
      <div>
        <span className="hub-cat">{hub.category}</span>
        <h3>{hub.name}</h3>
      </div>
      <p>{hub.tagline}</p>
      <span className="link-arrow">Explore hub <ArrowRight size={15} /></span>
    </Link>
  )
}

export function HubStripCard({ hub }) {
  return (
    <Link to={`/hubs/${hub.slug}`} className="card card-hover hub-strip-card" aria-label={`Explore ${hub.name}`}>
      <HubIcon hub={hub} size={20} />
      <h4>{hub.name}</h4>
    </Link>
  )
}
