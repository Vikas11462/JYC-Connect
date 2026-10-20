import { Info } from 'lucide-react'

// Shown whenever content is served from the local demo-data adapter
// instead of the live Express API. Never silently fakes live data.
export default function DemoNotice({ show, label = 'Demo data' }) {
  if (!show) return null
  return (
    <div className="demo-notice" role="note">
      <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
      <span>
        You are viewing <strong>{label}</strong>. Connect the Express backend by setting
        <code> VITE_API_BASE_URL </code> to load official, live content.
      </span>
    </div>
  )
}
