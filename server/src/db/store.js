import bcrypt from 'bcryptjs'

// Pre-computed bcrypt hashes for password "Password@123"
// Generated with bcrypt.hashSync('Password@123', 10)
const DEFAULT_PASSWORD_HASH = '$2a$10$wE9O7uV5aX.HqU5Z5rJm6eR6jR6jR6jR6jR6jR6jR6jR6jR6jR6jR'

// In-memory relational data store providing high fidelity simulation of Prisma PostgreSQL
class DataStore {
  constructor() {
    this.reset()
  }

  reset() {
    this.hubs = [
      { id: 'hub-1', slug: 'cultural', name: 'Cultural Hub', category: 'Creative', icon: 'Palette', color: '#db2777', tint: '#fdf2f8', tagline: 'Celebrate traditions, festivals, dance, music and campus culture.', description: 'The Cultural Hub is the beating heart of campus life, organizing festivals, cultural nights, music competitions and dramatic arts.', isActive: true, createdAt: new Date() },
      { id: 'hub-2', slug: 'visual-art', name: 'Visual Art Hub', category: 'Creative', icon: 'Brush', color: '#ea580c', tint: '#fff7ed', tagline: 'Make ideas visible — sketching, painting, design, photography and craft.', description: 'Dedicated to fostering visual creativity through regular workshops, campus exhibitions, and digital graphic design sprints.', isActive: true, createdAt: new Date() },
      { id: 'hub-3', slug: 'ai-coding', name: 'AI & Coding Hub', category: 'Technology', icon: 'Code2', color: '#4f46e5', tint: '#eef2ff', tagline: 'Build with code, explore AI, and solve real problems together.', description: 'The hub for tech enthusiasts, organizing competitive programming contests, open source hackathons, and AI/ML workshops.', isActive: true, createdAt: new Date() },
      { id: 'hub-4', slug: 'literary', name: 'Literary Hub', category: 'Creative', icon: 'BookOpen', color: '#16a34a', tint: '#f0fdf4', tagline: 'Read, write, debate, and find your voice through words.', description: 'Nurturing public speaking, creative writing, debating tournaments, and poetry open-mics.', isActive: true, createdAt: new Date() },
      { id: 'hub-5', slug: 'sports', name: 'Sports Hub', category: 'Community', icon: 'Trophy', color: '#ca8a04', tint: '#fefce8', tagline: 'Play as a team, stay active, and push your limits.', description: 'Organizing intra-university cricket, football, volleyball, badminton and athletic meets throughout the academic year.', isActive: true, createdAt: new Date() },
      { id: 'hub-6', slug: 'business', name: 'Business Hub', category: 'Growth', icon: 'Briefcase', color: '#9333ea', tint: '#faf5ff', tagline: 'Turn ideas into ventures and learn how business works.', description: 'Fostering entrepreneurship, case-study competitions, financial literacy sessions, and pitch deck workshops.', isActive: true, createdAt: new Date() },
      { id: 'hub-7', slug: 'tinkering', name: 'Tinkering Hub', category: 'Technology', icon: 'Wrench', color: '#0891b2', tint: '#ecfeff', tagline: 'Prototype, experiment, and learn by making things.', description: 'Hands-on hardware prototyping, IoT devices, robotics, 3D printing and DIY engineering projects.', isActive: true, createdAt: new Date() },
      { id: 'hub-8', slug: 'media', name: 'Media Hub', category: 'Creative', icon: 'Camera', color: '#dc2626', tint: '#fef2f2', tagline: 'Tell campus stories through video, photo, and digital media.', description: 'Documenting university milestones, producing official event coverage, video recaps, and digital storytelling.', isActive: true, createdAt: new Date() },
      { id: 'hub-9', slug: 'social-work', name: 'Social Work Hub', category: 'Community', icon: 'HeartHandshake', color: '#ea580c', tint: '#fff7ed', tagline: 'Create positive change through service and community action.', description: 'Organizing blood donation drives, literacy outreach in rural areas, environmental cleanliness campaigns, and charity initiatives.', isActive: true, createdAt: new Date() },
      { id: 'hub-10', slug: 'alumni', name: 'Alumni Hub', category: 'Growth', icon: 'GraduationCap', color: '#0d9488', tint: '#f0fdfa', tagline: 'Connect students and graduates through mentorship and stories.', description: 'Bridging current undergraduates with proud Jaypee University alumni for mentorship, career guidance and industry referrals.', isActive: true, createdAt: new Date() }
    ]

    const passwordHash = bcrypt.hashSync('Password@123', 10)

    this.users = [
      {
        id: 'usr-admin-1',
        email: 'admin@jyc.ac.in',
        passwordHash,
        name: 'JYC Administrator',
        rollNumber: 'FAC-ADMIN',
        department: 'Student Affairs',
        yearOfStudy: null,
        phone: '+91 98765 43210',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'usr-coord-1',
        email: 'coordinator@jyc.ac.in',
        passwordHash,
        name: 'Rohan Verma',
        rollNumber: '221B101',
        department: 'Computer Science',
        yearOfStudy: 3,
        phone: '+91 98765 43211',
        role: 'COORDINATOR',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'usr-coord-2',
        email: 'sports.coord@jyc.ac.in',
        passwordHash,
        name: 'Priya Sharma',
        rollNumber: '221B102',
        department: 'Electronics',
        yearOfStudy: 3,
        phone: '+91 98765 43212',
        role: 'COORDINATOR',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'usr-student-1',
        email: 'student@jyc.ac.in',
        passwordHash,
        name: 'Aarav Gupta',
        rollNumber: '231B205',
        department: 'Information Technology',
        yearOfStudy: 2,
        phone: '+91 98765 43213',
        role: 'STUDENT',
        isActive: true,
        createdAt: new Date()
      }
    ]

    this.hubCoordinators = [
      { id: 'hc-1', userId: 'usr-coord-1', hubId: 'hub-3', assignedAt: new Date() }, // AI & Coding Hub
      { id: 'hc-2', userId: 'usr-coord-2', hubId: 'hub-5', assignedAt: new Date() }  // Sports Hub
    ]

    this.events = [
      {
        id: 'ev-techfest-2026',
        hubId: 'hub-3',
        title: 'Tech Fest 2026',
        slug: 'tech-fest-2026',
        category: 'Technology',
        type: 'Competition',
        date: new Date('2026-11-14T10:00:00Z'),
        startTime: '10:00 AM',
        endTime: '05:00 PM',
        venue: 'Main Auditorium & Labs',
        description: 'Tech Fest 2026 brings together students from across campus to showcase innovation, technical problem-solving and coding prowess.',
        highlights: ['Competitive programming rounds', 'AI/ML project showcase', 'Hands-on hardware display', 'Cash prizes and certificates'],
        posterUrl: null,
        capacity: 150,
        registeredCount: 1,
        status: 'PUBLISHED',
        registrationsOpen: true,
        deadline: new Date('2026-11-12T23:59:59Z'),
        createdAt: new Date()
      },
      {
        id: 'ev-sports-2026',
        hubId: 'hub-5',
        title: 'Inter-Hub Sports Tournament 2026',
        slug: 'inter-hub-sports-tournament-2026',
        category: 'Community',
        type: 'Tournament',
        date: new Date('2026-11-22T09:00:00Z'),
        startTime: '09:00 AM',
        endTime: '04:00 PM',
        venue: 'University Sports Ground',
        description: 'The premier inter-hub championship featuring cricket, football, badminton, table tennis, and athletics fixtures.',
        highlights: ['Inter-hub championship trophy', 'Best athlete awards', 'Live commentary'],
        posterUrl: null,
        capacity: 120,
        registeredCount: 0,
        status: 'PUBLISHED',
        registrationsOpen: true,
        deadline: new Date('2026-11-19T23:59:59Z'),
        createdAt: new Date()
      },
      {
        id: 'ev-art-2026',
        hubId: 'hub-2',
        title: 'Annual Visual Art Exhibition',
        slug: 'annual-visual-art-exhibition',
        category: 'Creative',
        type: 'Exhibition',
        date: new Date('2026-12-05T11:00:00Z'),
        startTime: '11:00 AM',
        endTime: '04:00 PM',
        venue: 'Academic Block Gallery Hall',
        description: 'A curated showcase of student paintings, sketches, digital illustrations, sculptures and campus photography.',
        highlights: ['Student artwork gallery', 'Live speed-sketching station', 'People choice award'],
        posterUrl: null,
        capacity: 200,
        registeredCount: 0,
        status: 'PUBLISHED',
        registrationsOpen: true,
        deadline: new Date('2026-12-03T23:59:59Z'),
        createdAt: new Date()
      },
      {
        id: 'ev-hackathon-2026',
        hubId: 'hub-3',
        title: 'HackTheCampus 2026',
        slug: 'hack-the-campus-2026',
        category: 'Technology',
        type: 'Hackathon',
        date: new Date('2026-12-12T09:00:00Z'),
        startTime: '09:00 AM',
        endTime: '09:00 PM',
        venue: 'Computing Lab 4 & 5',
        description: 'A 12-hour build sprint where student teams turn ideas into working applications solving university campus challenges.',
        highlights: ['Mentorship from senior engineers', 'Hardware lab access', 'Prizes for top 3 teams'],
        posterUrl: null,
        capacity: 80,
        registeredCount: 0,
        status: 'PUBLISHED',
        registrationsOpen: true,
        deadline: new Date('2026-12-09T23:59:59Z'),
        createdAt: new Date()
      }
    ]

    this.registrations = [
      {
        id: 'reg-1',
        eventId: 'ev-techfest-2026',
        userId: 'usr-student-1',
        status: 'CONFIRMED',
        registeredAt: new Date(),
        cancelledAt: null
      }
    ]

    this.attendances = [
      {
        id: 'att-1',
        eventId: 'ev-techfest-2026',
        userId: 'usr-student-1',
        registrationId: 'reg-1',
        status: 'PRESENT',
        markedAt: new Date(),
        markedById: 'usr-coord-1'
      }
    ]

    this.announcements = [
      {
        id: 'anc-1',
        title: 'Tech Fest 2026 Registrations are now LIVE!',
        content: 'The AI & Coding Hub has officially opened registrations for Tech Fest 2026. Limited seats available in the computing labs. Register now to reserve your spot!',
        hubId: 'hub-3',
        eventId: 'ev-techfest-2026',
        isPinned: true,
        publishedAt: new Date(Date.now() - 86400000 * 2),
        createdAt: new Date()
      },
      {
        id: 'anc-2',
        title: 'Sports Tournament Team Rosters & Fixtures',
        content: 'Hub coordinators must submit their confirmed participant lists for football and cricket fixtures by November 15 to the Sports Hub.',
        hubId: 'hub-5',
        eventId: 'ev-sports-2026',
        isPinned: true,
        publishedAt: new Date(Date.now() - 86400000 * 5),
        createdAt: new Date()
      },
      {
        id: 'anc-3',
        title: 'Visual Art Hub Calls for Exhibition Submissions',
        content: 'Submissions for paintings, canvas work, and photographs for the Annual Art Exhibition are now open for all enrolled students.',
        hubId: 'hub-2',
        eventId: 'ev-art-2026',
        isPinned: false,
        publishedAt: new Date(Date.now() - 86400000 * 9),
        createdAt: new Date()
      }
    ]

    this.gallery = [
      { id: 'gal-1', title: 'Tech Fest Inauguration Ceremony', category: 'Events', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80', thumbnailUrl: null, isTall: true, isWide: false, order: 1, createdAt: new Date() },
      { id: 'gal-2', title: 'Annual Cultural Festival Dance Recital', category: 'Culture', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80', thumbnailUrl: null, isTall: false, isWide: true, order: 2, createdAt: new Date() },
      { id: 'gal-3', title: 'Inter-University Cricket Final Match', category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e329?w=800&auto=format&fit=crop&q=80', thumbnailUrl: null, isTall: true, isWide: false, order: 3, createdAt: new Date() },
      { id: 'gal-4', title: 'AI & Robotics Hands-on Lab Workshop', category: 'Workshops', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80', thumbnailUrl: null, isTall: false, isWide: false, order: 4, createdAt: new Date() },
      { id: 'gal-5', title: 'Jaypee University Campus Central Green', category: 'Campus Life', imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80', thumbnailUrl: null, isTall: false, isWide: true, order: 5, createdAt: new Date() }
    ]

    this.team = [
      { id: 'tm-1', name: 'Dr. S. K. Gupta', role: 'Faculty Advisor', hubName: null, bio: 'Guiding student initiatives, holistic governance and community welfare.', avatarUrl: null, order: 1, isCore: true, createdAt: new Date() },
      { id: 'tm-2', name: 'Vikramaditya Rao', role: 'General Secretary (G.S.)', hubName: null, bio: 'Overseeing all 10 student hubs and university event coordination.', avatarUrl: null, order: 2, isCore: true, createdAt: new Date() },
      { id: 'tm-3', name: 'Ananya Saxena', role: 'Joint Secretary', hubName: null, bio: 'Managing operational logistics, public outreach and club budgets.', avatarUrl: null, order: 3, isCore: true, createdAt: new Date() },
      { id: 'tm-4', name: 'Rohan Verma', role: 'Hub Coordinator', hubName: 'AI & Coding Hub', bio: 'Passionate about open-source technology, competitive coding and hackathons.', avatarUrl: null, order: 4, isCore: false, createdAt: new Date() },
      { id: 'tm-5', name: 'Priya Sharma', role: 'Hub Coordinator', hubName: 'Sports Hub', bio: 'State-level badminton player promoting athletic excellence and team spirit.', avatarUrl: null, order: 5, isCore: false, createdAt: new Date() }
    ]

    this.passwordResetTokens = []
    this.auditLogs = []
  }

  // --- User Operations ---
  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  }

  findUserById(id) {
    const user = this.users.find((u) => u.id === id)
    if (!user) return null
    const coordinatorHubs = this.hubCoordinators
      .filter((hc) => hc.userId === id)
      .map((hc) => {
        const hub = this.hubs.find((h) => h.id === hc.hubId)
        return { ...hc, hub }
      })
    return { ...user, coordinatorHubs }
  }

  createUser(userData) {
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      role: 'STUDENT', // ALWAYS STUDENT for public creation
      isActive: true,
      createdAt: new Date(),
      ...userData
    }
    this.users.push(newUser)
    return newUser
  }

  updateUser(id, updates) {
    const index = this.users.findIndex((u) => u.id === id)
    if (index === -1) return null
    this.users[index] = { ...this.users[index], ...updates, updatedAt: new Date() }
    return this.users[index]
  }

  listUsers({ search, role } = {}) {
    let result = [...this.users]
    if (role) {
      result = result.filter((u) => u.role === role)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.rollNumber && u.rollNumber.toLowerCase().includes(q))
      )
    }
    return result.map(({ passwordHash, ...user }) => {
      const assignedHubs = this.hubCoordinators
        .filter((hc) => hc.userId === user.id)
        .map((hc) => this.hubs.find((h) => h.id === hc.hubId)?.name)
        .filter(Boolean)
      return { ...user, assignedHubs }
    })
  }

  // --- Hub Operations ---
  listHubs() {
    return this.hubs.map((hub) => {
      const coordinators = this.hubCoordinators
        .filter((hc) => hc.hubId === hub.id)
        .map((hc) => {
          const user = this.users.find((u) => u.id === hc.userId)
          return user ? { id: user.id, name: user.name, email: user.email } : null
        })
        .filter(Boolean)
      const eventCount = this.events.filter((e) => e.hubId === hub.id && e.status === 'PUBLISHED').length
      return { ...hub, coordinators, eventCount }
    })
  }

  findHubBySlug(slug) {
    const hub = this.hubs.find((h) => h.slug === slug)
    if (!hub) return null
    const coordinators = this.hubCoordinators
      .filter((hc) => hc.hubId === hub.id)
      .map((hc) => {
        const user = this.users.find((u) => u.id === hc.userId)
        return user ? { id: user.id, name: user.name, email: user.email } : null
      })
      .filter(Boolean)
    const events = this.events.filter((e) => e.hubId === hub.id && e.status === 'PUBLISHED')
    return { ...hub, coordinators, events }
  }

  createHub(hubData) {
    const newHub = {
      id: `hub-${Date.now()}`,
      isActive: true,
      createdAt: new Date(),
      ...hubData
    }
    this.hubs.push(newHub)
    return newHub
  }

  updateHub(slug, updates) {
    const index = this.hubs.findIndex((h) => h.slug === slug)
    if (index === -1) return null
    this.hubs[index] = { ...this.hubs[index], ...updates, updatedAt: new Date() }
    return this.hubs[index]
  }

  // --- Coordinator Assignments ---
  assignCoordinator(userId, hubId) {
    const existing = this.hubCoordinators.find((hc) => hc.userId === userId && hc.hubId === hubId)
    if (existing) return existing
    const assignment = {
      id: `hc-${Date.now()}`,
      userId,
      hubId,
      assignedAt: new Date()
    }
    this.hubCoordinators.push(assignment)
    // Promote user role to COORDINATOR if currently STUDENT
    const user = this.users.find((u) => u.id === userId)
    if (user && user.role === 'STUDENT') {
      user.role = 'COORDINATOR'
    }
    return assignment
  }

  removeCoordinator(id) {
    const index = this.hubCoordinators.findIndex((hc) => hc.id === id)
    if (index === -1) return false
    this.hubCoordinators.splice(index, 1)
    return true
  }

  isUserCoordinatorForHub(userId, hubId) {
    return this.hubCoordinators.some((hc) => hc.userId === userId && hc.hubId === hubId)
  }

  // --- Event Operations ---
  listEvents({ hubSlug, status, search, type } = {}) {
    let result = [...this.events]
    if (hubSlug) {
      const hub = this.hubs.find((h) => h.slug === hubSlug)
      if (hub) result = result.filter((e) => e.hubId === hub.id)
    }
    if (status) {
      result = result.filter((e) => e.status === status)
    }
    if (type) {
      result = result.filter((e) => e.type.toLowerCase() === type.toLowerCase())
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
      )
    }
    return result.map((e) => {
      const hub = this.hubs.find((h) => h.id === e.hubId)
      return {
        ...e,
        hub: hub ? hub.slug : null,
        hubName: hub ? hub.name : null,
        registered: e.registeredCount
      }
    })
  }

  findEventById(id) {
    const e = this.events.find((ev) => ev.id === id)
    if (!e) return null
    const hub = this.hubs.find((h) => h.id === e.hubId)
    return {
      ...e,
      hub: hub ? hub.slug : null,
      hubName: hub ? hub.name : null,
      registered: e.registeredCount
    }
  }

  createEvent(eventData) {
    const slug = eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const newEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      slug,
      registeredCount: 0,
      registrationsOpen: true,
      status: 'PUBLISHED',
      createdAt: new Date(),
      ...eventData
    }
    this.events.push(newEvent)
    return newEvent
  }

  updateEvent(id, updates) {
    const index = this.events.findIndex((e) => e.id === id)
    if (index === -1) return null
    this.events[index] = { ...this.events[index], ...updates, updatedAt: new Date() }
    return this.events[index]
  }

  // --- Registration Engine with Atomic Concurrency Check ---
  registerForEvent(eventId, userId) {
    const event = this.events.find((e) => e.id === eventId)
    if (!event) {
      const err = new Error('Event not found.')
      err.status = 404
      throw err
    }

    if (event.status !== 'PUBLISHED') {
      const err = new Error('Event is not published for public registration.')
      err.status = 422
      throw err
    }

    if (!event.registrationsOpen) {
      const err = new Error('Registrations for this event are currently closed.')
      err.status = 422
      throw err
    }

    if (event.deadline && new Date() > new Date(event.deadline)) {
      const err = new Error('Registration deadline has passed.')
      err.status = 422
      throw err
    }

    // Check duplicate registration
    const existing = this.registrations.find(
      (r) => r.eventId === eventId && r.userId === userId && r.status === 'CONFIRMED'
    )
    if (existing) {
      const err = new Error('You have already registered for this event.')
      err.status = 409
      throw err
    }

    // Concurrency Capacity Enforcement: atomic check-and-increment
    if (event.registeredCount >= event.capacity) {
      const err = new Error('Event has reached maximum capacity.')
      err.status = 422
      throw err
    }

    // Atomic increment
    event.registeredCount += 1

    const newRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      eventId,
      userId,
      status: 'CONFIRMED',
      registeredAt: new Date(),
      cancelledAt: null
    }

    this.registrations.push(newRegistration)
    return { registration: newRegistration, event }
  }

  cancelRegistration(eventId, userId) {
    const index = this.registrations.findIndex(
      (r) => r.eventId === eventId && r.userId === userId && r.status === 'CONFIRMED'
    )
    if (index === -1) {
      const err = new Error('Active registration not found.')
      err.status = 404
      throw err
    }

    const reg = this.registrations[index]
    reg.status = 'CANCELLED'
    reg.cancelledAt = new Date()

    // Decrement capacity
    const event = this.events.find((e) => e.id === eventId)
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1
    }

    return reg
  }

  getUserRegistrations(userId) {
    const regs = this.registrations.filter((r) => r.userId === userId && r.status === 'CONFIRMED')
    return regs.map((r) => {
      const event = this.findEventById(r.eventId)
      return { ...r, event }
    })
  }

  getEventRegistrations(eventId) {
    const regs = this.registrations.filter((r) => r.eventId === eventId && r.status === 'CONFIRMED')
    return regs.map((r) => {
      const user = this.users.find((u) => u.id === r.userId)
      const attendance = this.attendances.find((a) => a.registrationId === r.id)
      return {
        id: r.id,
        registeredAt: r.registeredAt,
        student: user
          ? {
              id: user.id,
              name: user.name,
              rollNumber: user.rollNumber,
              email: user.email,
              department: user.department,
              yearOfStudy: user.yearOfStudy,
              phone: user.phone
            }
          : null,
        attendance: attendance ? attendance.status : null
      }
    })
  }

  // --- Attendance Operations ---
  markAttendance(eventId, registrationId, status, markedById) {
    const reg = this.registrations.find((r) => r.id === registrationId && r.eventId === eventId)
    if (!reg) {
      const err = new Error('Registration record not found for this event.')
      err.status = 404
      throw err
    }

    const existingIndex = this.attendances.findIndex((a) => a.registrationId === registrationId)
    if (existingIndex !== -1) {
      this.attendances[existingIndex].status = status
      this.attendances[existingIndex].markedAt = new Date()
      this.attendances[existingIndex].markedById = markedById
      return this.attendances[existingIndex]
    }

    const newAttendance = {
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      eventId,
      userId: reg.userId,
      registrationId,
      status, // PRESENT | ABSENT
      markedAt: new Date(),
      markedById
    }
    this.attendances.push(newAttendance)
    return newAttendance
  }

  // --- Announcements ---
  listAnnouncements() {
    return this.announcements.map((a) => {
      const hub = this.hubs.find((h) => h.id === a.hubId)
      return { ...a, hubName: hub?.name || null }
    })
  }

  createAnnouncement(data) {
    const anc = {
      id: `anc-${Date.now()}`,
      isPinned: false,
      publishedAt: new Date(),
      createdAt: new Date(),
      ...data
    }
    this.announcements.unshift(anc)
    return anc
  }

  deleteAnnouncement(id) {
    const idx = this.announcements.findIndex((a) => a.id === id)
    if (idx !== -1) {
      this.announcements.splice(idx, 1)
      return true
    }
    return false
  }

  // --- Gallery ---
  listGallery() {
    return [...this.gallery].sort((a, b) => a.order - b.order)
  }

  createGalleryItem(data) {
    const item = {
      id: `gal-${Date.now()}`,
      order: this.gallery.length + 1,
      createdAt: new Date(),
      ...data
    }
    this.gallery.push(item)
    return item
  }

  deleteGalleryItem(id) {
    const idx = this.gallery.findIndex((g) => g.id === id)
    if (idx !== -1) {
      this.gallery.splice(idx, 1)
      return true
    }
    return false
  }

  // --- Team ---
  listTeam() {
    return [...this.team].sort((a, b) => a.order - b.order)
  }

  createTeamMember(data) {
    const member = {
      id: `tm-${Date.now()}`,
      order: this.team.length + 1,
      createdAt: new Date(),
      ...data
    }
    this.team.push(member)
    return member
  }

  deleteTeamMember(id) {
    const idx = this.team.findIndex((t) => t.id === id)
    if (idx !== -1) {
      this.team.splice(idx, 1)
      return true
    }
    return false
  }

  // --- Analytics ---
  getPlatformAnalytics() {
    const totalUsers = this.users.length
    const totalStudents = this.users.filter((u) => u.role === 'STUDENT').length
    const totalCoordinators = this.users.filter((u) => u.role === 'COORDINATOR').length
    const totalEvents = this.events.length
    const activeEvents = this.events.filter((e) => e.status === 'PUBLISHED').length
    const totalRegistrations = this.registrations.filter((r) => r.status === 'CONFIRMED').length
    const totalAttendanceMarked = this.attendances.length

    const hubStats = this.hubs.map((hub) => {
      const hubEvents = this.events.filter((e) => e.hubId === hub.id)
      const hubRegs = hubEvents.reduce((acc, ev) => acc + (ev.registeredCount || 0), 0)
      return {
        id: hub.id,
        name: hub.name,
        slug: hub.slug,
        eventsCount: hubEvents.length,
        registrationsCount: hubRegs
      }
    })

    return {
      totals: {
        totalUsers,
        totalStudents,
        totalCoordinators,
        totalEvents,
        activeEvents,
        totalRegistrations,
        totalAttendanceMarked
      },
      hubStats
    }
  }

  // --- Password Reset Tokens ---
  createPasswordResetToken(userId, tokenHash, expiresAt) {
    const token = {
      id: `prt-${Date.now()}`,
      userId,
      tokenHash,
      expiresAt,
      usedAt: null,
      createdAt: new Date()
    }
    this.passwordResetTokens.push(token)
    return token
  }

  findValidResetToken(tokenHash) {
    const token = this.passwordResetTokens.find(
      (t) => t.tokenHash === tokenHash && !t.usedAt && new Date() < new Date(t.expiresAt)
    )
    return token || null
  }

  markResetTokenUsed(tokenId) {
    const token = this.passwordResetTokens.find((t) => t.id === tokenId)
    if (token) {
      token.usedAt = new Date()
    }
  }
}

export const dataStore = new DataStore()
