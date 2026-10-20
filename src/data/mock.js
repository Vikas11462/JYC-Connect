// ============================================================
// DEMO DATA — clearly labelled demonstration content.
// Nothing in this file is an official JYC record.
// Replace by wiring the Express API (see src/services/content.js).
// ============================================================

export const HUBS = [
  { slug: 'cultural', name: 'Cultural Hub', category: 'Creative', icon: 'Palette', color: '#db2777', tint: '#fdf2f8',
    tagline: 'Celebrate traditions, festivals, dance, music and campus culture.' },
  { slug: 'visual-art', name: 'Visual Art Hub', category: 'Creative', icon: 'Brush', color: '#ea580c', tint: '#fff7ed',
    tagline: 'Make ideas visible — sketching, painting, design, photography and craft.' },
  { slug: 'ai-coding', name: 'AI & Coding Hub', category: 'Technology', icon: 'Code2', color: '#4f46e5', tint: '#eef2ff',
    tagline: 'Build with code, explore AI, and solve real problems together.' },
  { slug: 'literary', name: 'Literary Hub', category: 'Creative', icon: 'BookOpen', color: '#16a34a', tint: '#f0fdf4',
    tagline: 'Read, write, debate, and find your voice through words.' },
  { slug: 'sports', name: 'Sports Hub', category: 'Community', icon: 'Trophy', color: '#ca8a04', tint: '#fefce8',
    tagline: 'Play as a team, stay active, and push your limits.' },
  { slug: 'business', name: 'Business Hub', category: 'Growth', icon: 'Briefcase', color: '#9333ea', tint: '#faf5ff',
    tagline: 'Turn ideas into ventures and learn how business works.' },
  { slug: 'tinkering', name: 'Tinkering Hub', category: 'Technology', icon: 'Wrench', color: '#0891b2', tint: '#ecfeff',
    tagline: 'Prototype, experiment, and learn by making things.' },
  { slug: 'media', name: 'Media Hub', category: 'Creative', icon: 'Camera', color: '#dc2626', tint: '#fef2f2',
    tagline: 'Tell campus stories through video, photo, and digital media.' },
  { slug: 'social-work', name: 'Social Work Hub', category: 'Community', icon: 'HeartHandshake', color: '#ea580c', tint: '#fff7ed',
    tagline: 'Create positive change through service and community action.' },
  { slug: 'alumni', name: 'Alumni Hub', category: 'Growth', icon: 'GraduationCap', color: '#0d9488', tint: '#f0fdfa',
    tagline: 'Connect students and graduates through mentorship and stories.' },
]

const ev = (id, title, hubSlug, category, type, date, start, end, venue, status, opts = {}) => ({
  id, title, hub: hubSlug, category, type, date, startTime: start, endTime: end,
  venue, status, // upcoming | completed | cancelled
  registrationsOpen: opts.open ?? status === 'upcoming',
  capacity: opts.capacity ?? 100,
  registered: opts.registered ?? 0,
  deadline: opts.deadline ?? null,
  poster: opts.poster ?? null,
  description: opts.description ?? '',
  highlights: opts.highlights ?? [],
  organizer: opts.organizer ?? null, // { name, hub } — verified info only
})

export const EVENTS = [
  ev('demo-techfest-2026', 'Tech Fest 2026', 'ai-coding', 'Technology', 'Competition',
    '2026-11-14', '10:00 AM', '5:00 PM', 'Main Auditorium', 'upcoming',
    { registered: 86, capacity: 200, deadline: '2026-11-10',
      description: 'Tech Fest 2026 brings together students from across campus to showcase innovation, creativity and problem-solving. Participate in exciting challenges, workshops, and networking opportunities.',
      highlights: ['Coding competitions', 'Workshops and tech talks', 'Networking with peers', 'Certificates for participants'],
      organizer: { name: 'AI & Coding Hub', role: 'Organizing Hub' } }),
  ev('demo-sports-2026', 'Inter-Hub Sports Tournament', 'sports', 'Community', 'Tournament',
    '2026-11-22', '9:00 AM', '4:00 PM', 'Sports Ground', 'upcoming',
    { registered: 120, capacity: 160, deadline: '2026-11-18',
      description: 'An inter-hub tournament across cricket, football and athletics. Represent your hub, compete with spirit, and build lifelong friendships.',
      highlights: ['Cricket and football fixtures', 'Athletics track events', 'Team trophies'] }),
  ev('demo-art-2026', 'Annual Art Exhibition', 'visual-art', 'Creative', 'Exhibition',
    '2026-12-05', '11:00 AM', '4:00 PM', 'Academic Block', 'upcoming',
    { registered: 0, capacity: 300, deadline: null,
      description: 'A showcase of student artwork, photography and design from across the Visual Art Hub. Open to the entire campus community.',
      highlights: ['Student artwork showcase', 'Live sketching corner', 'Open to all students'] }),
  ev('demo-hackathon-2026', 'Hackathon 2026', 'ai-coding', 'Technology', 'Hackathon',
    '2026-12-12', '9:00 AM', '8:00 PM', 'Computing Labs', 'upcoming',
    { registered: 45, capacity: 80, deadline: '2026-12-08',
      description: 'A full-day build sprint. Form a team, pick a problem, and ship a working prototype by the end of the day.',
      highlights: ['Team-based builds', 'Mentor support', 'Prizes for top teams'] }),
  ev('demo-music-2027', 'Campus Music Night', 'cultural', 'Creative', 'Cultural',
    '2027-01-16', '6:00 PM', '9:30 PM', 'Open Air Theatre', 'upcoming',
    { registered: 150, capacity: 150, deadline: '2027-01-14',
      description: 'An evening of live music, performances and open-mic slots hosted by the Cultural Hub.',
      highlights: ['Live performances', 'Open mic slots', 'Cultural showcase'] }),
  ev('demo-drive-2026', 'Community Service Drive', 'social-work', 'Community', 'Initiative',
    '2026-11-29', '10:00 AM', '1:00 PM', 'Neighboring Village', 'upcoming',
    { registered: 30, capacity: 60, deadline: '2026-11-26',
      description: 'A community outreach initiative in collaboration with the Social Work Hub. Volunteers contribute time and effort to local causes.',
      highlights: ['Volunteer activity', 'Community outreach', 'Certificates of service'] }),
  ev('demo-past-literary', 'Literary Evening: Open Mic', 'literary', 'Creative', 'Open Mic',
    '2026-09-20', '5:00 PM', '7:00 PM', 'Seminar Hall', 'completed',
    { description: 'An evening of poetry, prose and storytelling from student writers across campus.', highlights: ['Student readings', 'Open floor'] }),
]

export const ANNOUNCEMENTS = [
  { id: 'a1', title: 'Registrations open for Tech Fest 2026', date: '2026-10-10',
    text: 'The AI & Coding Hub has opened registrations for Tech Fest 2026. Seats are limited — register early through the Events page.' },
  { id: 'a2', title: 'Inter-Hub Sports Tournament schedule released', date: '2026-10-06',
    text: 'Fixture details for the Sports Hub tournament are now available. Check the event page for timings and venue information.' },
  { id: 'a3', title: 'New Visual Art Hub workshop series', date: '2026-10-01',
    text: 'The Visual Art Hub announces a monthly workshop series covering sketching, photography and digital design.' },
]

// Placeholder team — real names and photos must be supplied and verified by JYC.
export const TEAM = [
  { id: 'gs-sec', name: 'Name Here', role: 'G.S. Secretary', hub: null, placeholder: true },
  { id: 'office-1', name: 'Name Here', role: 'Office Bearer', hub: null, placeholder: true },
  { id: 'coord-cultural', name: 'Name Here', role: 'Hub Coordinator', hub: 'Cultural Hub', placeholder: true },
  { id: 'coord-sports', name: 'Name Here', role: 'Hub Coordinator', hub: 'Sports Hub', placeholder: true },
  { id: 'coord-aicoding', name: 'Name Here', role: 'Hub Coordinator', hub: 'AI & Coding Hub', placeholder: true },
  { id: 'coord-media', name: 'Name Here', role: 'Hub Coordinator', hub: 'Media Hub', placeholder: true },
]

// Placeholder gallery — replace with approved JYC photographs.
export const GALLERY = [
  { id: 'g1', title: 'Campus gathering', category: 'Events', tall: true, span: '' },
  { id: 'g2', title: 'Cultural performance', category: 'Culture', tall: false, span: 'wide' },
  { id: 'g3', title: 'Sports day', category: 'Sports', tall: true, span: '' },
  { id: 'g4', title: 'Workshop session', category: 'Workshops', tall: false, span: '' },
  { id: 'g5', title: 'Team photo', category: 'Campus Life', tall: false, span: '' },
  { id: 'g6', title: 'Badminton match', category: 'Sports', tall: false, span: '' },
  { id: 'g7', title: 'Fest night', category: 'Events', tall: true, span: '' },
  { id: 'g8', title: 'Campus building', category: 'Campus Life', tall: false, span: 'wide' },
  { id: 'g9', title: 'Coding activity', category: 'Workshops', tall: false, span: '' },
]

export const GALLERY_FILTERS = ['All', 'Events', 'Workshops', 'Sports', 'Culture', 'Campus Life']

export const hubBySlug = (slug) => HUBS.find((h) => h.slug === slug)
export const eventsForHub = (slug) => EVENTS.filter((e) => e.hub === slug)
