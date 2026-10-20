import { AlertTriangle } from 'lucide-react'

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <AlertTriangle size={40} strokeWidth={1.5} aria-hidden="true" />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {onRetry && <button className="btn btn-outline" onClick={onRetry}>Try again</button>}
    </div>
  )
}
