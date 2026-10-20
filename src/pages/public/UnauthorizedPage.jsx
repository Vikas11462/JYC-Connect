import { Link } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'

export default function UnauthorizedPage() {
  return (
    <div className="container section">
      <EmptyState
        title="Unauthorized"
        message="You do not have permission to view this page. Please sign in with an appropriate account."
        action={<Link to="/login" className="btn btn-primary">Go to login</Link>}
      />
    </div>
  )
}
