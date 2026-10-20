import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function ProtectedRoute({ roles = [], children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="loading-page"><LoadingSpinner /><p>Restoring your session…</p></div>
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  return children
}
