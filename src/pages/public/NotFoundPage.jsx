import { Link } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'

export default function NotFoundPage() {
  return (
    <div className="container section">
      <EmptyState
        title="Page not found"
        message="The page you are looking for does not exist or may have been moved."
        action={<Link to="/" className="btn btn-primary">Back to home</Link>}
      />
    </div>
  )
}
