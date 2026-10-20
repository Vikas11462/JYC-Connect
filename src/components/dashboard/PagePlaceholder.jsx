import DemoNotice from '../common/DemoNotice'
import EmptyState from '../common/EmptyState'

// Used for admin/coordinator management screens that need the
// Express API before they can manage real records.
export default function PagePlaceholder({ title, description, demo }) {
  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.6rem' }}>{title}</h1>
      <DemoNotice show={demo} label="demo mode — management UI scaffold" />
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <EmptyState
          title="Waiting for backend connection"
          message={description}
        />
      </div>
    </div>
  )
}
