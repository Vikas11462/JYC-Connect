import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function SectionHeading({ eyebrow, title, sub, linkTo, linkLabel }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="section-title">{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="link-arrow">
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}
