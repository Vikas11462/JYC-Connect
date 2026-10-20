// ============================================================
// Central site configuration.
// Update official contact details, links and metadata here ONLY.
// Do not scatter contact info across components.
// ============================================================

export const SITE = {
  name: 'JYC Connect',
  tagline: 'Discover. Participate. Belong.',
  heroHeadlineA: 'Find your people.',
  heroHeadlineB: 'Discover your passion.',
  university: 'Jaypee University, Anoopshahr',
  universityShort: 'JUA',
  clubName: 'Jaypee Youth Club',
  copyright: `© ${new Date().getFullYear()} JYC Connect. All rights reserved.`,
}

// Official contact placeholders — replace with verified details before launch.
export const CONTACT = {
  email: '', // e.g. jyc@jua.example.edu — leave empty until officially confirmed
  phone: '',
  address: 'Jaypee University, Anoopshahr, Uttar Pradesh, India',
  socials: [], // [{ label, url }] — approved links only
}

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/hubs', label: 'Hubs' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About JYC' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
]
