import { db } from '../../db/prisma.js'

export const eventsController = {
  list(req, res) {
    const { hub, status, search, type } = req.query
    const events = db.listEvents({
      hubSlug: hub,
      status,
      search,
      type
    })
    res.json(events)
  },

  get(req, res) {
    const { id } = req.params
    const event = db.findEventById(id)
    if (!event) {
      return res.status(404).json({ error: 'NotFound', message: 'Event not found.' })
    }

    let isRegistered = false
    if (req.user) {
      const userRegs = db.getUserRegistrations(req.user.id)
      isRegistered = userRegs.some((r) => r.eventId === id)
    }

    res.json({ ...event, isRegistered })
  },

  create(req, res, next) {
    try {
      const {
        title,
        hubId,
        category,
        type,
        date,
        startTime,
        endTime,
        venue,
        description,
        highlights,
        capacity,
        deadline,
        posterUrl
      } = req.body

      if (!title || !hubId || !date || !venue) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'Title, hubId, date, and venue are required.'
        })
      }

      // Check coordinator authorization for this hub
      if (req.user.role === 'COORDINATOR') {
        const isAssigned = db.isUserCoordinatorForHub(req.user.id, hubId)
        if (!isAssigned) {
          return res.status(403).json({
            error: 'Forbidden',
            message: 'You are not authorized to create events for this hub.'
          })
        }
      }

      const event = db.createEvent({
        title,
        hubId,
        category: category || 'General',
        type: type || 'Event',
        date: new Date(date),
        startTime: startTime || '10:00 AM',
        endTime: endTime || '05:00 PM',
        venue,
        description: description || '',
        highlights: Array.isArray(highlights) ? highlights : [],
        capacity: capacity ? parseInt(capacity, 10) : 100,
        deadline: deadline ? new Date(deadline) : null,
        posterUrl: posterUrl || null
      })

      res.status(201).json(event)
    } catch (err) {
      next(err)
    }
  },

  update(req, res, next) {
    try {
      const { id } = req.params
      const event = db.findEventById(id)
      if (!event) {
        return res.status(404).json({ error: 'NotFound', message: 'Event not found.' })
      }

      // Check coordinator authorization
      if (req.user.role === 'COORDINATOR') {
        const isAssigned = db.isUserCoordinatorForHub(req.user.id, event.hubId)
        if (!isAssigned) {
          return res.status(403).json({
            error: 'Forbidden',
            message: 'You can only edit events belonging to your assigned hub.'
          })
        }
      }

      const updated = db.updateEvent(id, req.body)
      res.json(updated)
    } catch (err) {
      next(err)
    }
  },

  register(req, res, next) {
    try {
      const { id } = req.params
      const result = db.registerForEvent(id, req.user.id)
      res.status(201).json({
        message: 'Successfully registered for event.',
        registration: result.registration
      })
    } catch (err) {
      next(err)
    }
  },

  cancelRegistration(req, res, next) {
    try {
      const { id } = req.params
      const cancelled = db.cancelRegistration(id, req.user.id)
      res.json({
        message: 'Registration cancelled successfully.',
        registration: cancelled
      })
    } catch (err) {
      next(err)
    }
  },

  getRegistrations(req, res, next) {
    try {
      const { id } = req.params
      const event = db.findEventById(id)
      if (!event) {
        return res.status(404).json({ error: 'NotFound', message: 'Event not found.' })
      }

      // Check authorization
      if (req.user.role === 'COORDINATOR') {
        const isAssigned = db.isUserCoordinatorForHub(req.user.id, event.hubId)
        if (!isAssigned) {
          return res.status(403).json({
            error: 'Forbidden',
            message: 'You can only view registrations for your assigned hub.'
          })
        }
      }

      const list = db.getEventRegistrations(id)
      res.json(list)
    } catch (err) {
      next(err)
    }
  }
}
