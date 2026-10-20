export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="loading-page" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}
