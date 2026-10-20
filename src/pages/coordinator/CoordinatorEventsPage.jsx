import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import EventCard from '../../components/events/EventCard'
import Modal from '../../components/common/Modal'
import DemoNotice from '../../components/common/DemoNotice'
import { EVENTS } from '../../data/mock'

export default function CoordinatorEventsPage() {
  const [toDelete, setToDelete] = useState(null)
  const [deleted, setDeleted] = useState([])

  return (
    <div>
      <div className="section-head">
        <div>
          <h1 className="section-title" style={{ fontSize: '1.6rem' }}>My Events</h1>
          <p className="section-sub">Create, edit and manage events for your assigned hub.</p>
        </div>
        <Link to="/coordinator/events/new" className="btn btn-primary">+ Create event</Link>
      </div>
      <DemoNotice show />
      <div className="grid grid-3">
        {EVENTS.filter((e) => !deleted.includes(e.id)).map((e) => (
          <div key={e.id} style={{ position: 'relative' }}>
            <EventCard event={e} />
            <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
              <Link to={`/coordinator/events/new?edit=${e.id}`} className="btn btn-secondary btn-sm" aria-label={`Edit ${e.title}`}><Pencil size={14} /></Link>
              <button className="btn btn-danger btn-sm" onClick={() => setToDelete(e)} aria-label={`Delete ${e.title}`}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {toDelete && (
        <Modal title="Delete event?" onClose={() => setToDelete(null)}>
          <p>This will remove <strong>{toDelete.title}</strong>. In production this calls the Express API and cannot be undone.</p>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setToDelete(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => { setDeleted((d) => [...d, toDelete.id]); setToDelete(null) }}>Delete (demo)</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
