// ============================================================
// HTTP client for the Express.js backend.
// Set VITE_API_BASE_URL (e.g. http://localhost:4000) to go live.
// Never store secrets or JWT signing keys in this file.
// ============================================================

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body } = {}) {
  if (!BASE_URL) {
    throw new ApiError(
      'Backend API is not configured. Set VITE_API_BASE_URL in your .env file.',
      0,
    )
  }
  const token = localStorage.getItem('jyc_token')
  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })
  } catch {
    throw new ApiError('Cannot reach the JYC server. Check your connection and API URL.', 0)
  }
  let data = null
  try { data = await res.json() } catch { /* response without JSON body */ }
  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed with status ${res.status}.`, res.status)
  }
  return { data, status: res.status }
}

export const api = {
  configured: Boolean(BASE_URL),
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
}
