import { useState } from 'react'
import { SITE } from '../../config/site'

// Uses the official JYC logo at /jyc-logo.png when present.
// Place the official logo file in the public/ folder of the project.
export default function Logo({ light = false }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <span className="brand">
      {imgOk ? (
        <img
          src="/jyc-logo.png"
          alt="JYC logo"
          onError={() => setImgOk(false)}
        />
      ) : (
        <span
          aria-hidden="true"
          style={{
            width: 40, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center',
            background: 'linear-gradient(135deg, var(--indigo-800), var(--violet-500))',
            color: '#fff', fontWeight: 900, fontSize: '.8rem',
          }}
        >
          JYC
        </span>
      )}
      <span>
        <span className="brand-name" style={light ? { color: '#fff' } : undefined}>{SITE.name}</span>
        <br />
        <span className="brand-sub">{SITE.university}</span>
      </span>
    </span>
  )
}
