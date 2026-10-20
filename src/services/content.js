// ============================================================
// Content service — single access point for events, hubs,
// announcements, gallery and team data.
//
// When VITE_API_BASE_URL is set, the real Express API is used.
// Otherwise clearly-labelled demo data is returned so the UI can
// be developed and reviewed without a backend.
// Demo data is NEVER silently presented as live production data:
// every response carries a `source` flag ('api' | 'demo').
// ============================================================

import { api } from './api'
import { EVENTS, HUBS, ANNOUNCEMENTS, GALLERY, TEAM, hubBySlug } from '../data/mock'

async function withFallback(path, fallback) {
  if (api.configured) {
    try {
      const { data } = await api.get(path)
      return { data, source: 'api', error: null }
    } catch (e) {
      return { data: fallback, source: 'demo', error: e.message }
    }
  }
  return { data: fallback, source: 'demo', error: null }
}

const qs = (params = {}) => {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  const s = new URLSearchParams(clean).toString()
  return s ? `?${s}` : ''
}

export const content = {
  listEvents: (params) => withFallback(`/api/events${qs(params)}`, EVENTS),
  getEvent: (id) =>
    withFallback(`/api/events/${id}`, EVENTS.find((e) => e.id === id) ?? null),
  listHubs: () => withFallback('/api/hubs', HUBS),
  getHub: (slug) => withFallback(`/api/hubs/${slug}`, hubBySlug(slug) ?? null),
  listAnnouncements: () => withFallback('/api/announcements', ANNOUNCEMENTS),
  listGallery: () => withFallback('/api/gallery', GALLERY),
  listTeam: () => withFallback('/api/team', TEAM),

  // Registration requires a live backend — never faked.
  async registerForEvent(eventId) {
    if (!api.configured) {
      throw new Error('Registration requires the JYC backend API. Set VITE_API_BASE_URL.')
    }
    const { data } = await api.post(`/api/events/${eventId}/register`)
    return data
  },
  myRegistrations: () => withFallback('/api/me/registrations', []),
}
