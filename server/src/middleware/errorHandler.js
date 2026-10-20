export function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'

  // Log server errors
  if (status >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err)
  }

  res.status(status).json({
    error: err.name || 'Error',
    message,
    status,
    timestamp: new Date().toISOString()
  })
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'NotFound',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    status: 404
  })
}
