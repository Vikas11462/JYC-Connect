import { db } from '../../db/prisma.js'

export const announcementsController = {
  list(req, res) {
    const list = db.listAnnouncements()
    res.json(list)
  },

  create(req, res, next) {
    try {
      const { title, content, hubId, eventId, isPinned } = req.body
      if (!title || !content) {
        return res.status(400).json({ error: 'BadRequest', message: 'Title and content are required.' })
      }

      // If coordinator, enforce hub ownership
      if (req.user.role === 'COORDINATOR' && hubId) {
        const isAssigned = db.isUserCoordinatorForHub(req.user.id, hubId)
        if (!isAssigned) {
          return res.status(403).json({
            error: 'Forbidden',
            message: 'You can only publish announcements for your assigned hub.'
          })
        }
      }

      const announcement = db.createAnnouncement({
        title,
        content,
        hubId: hubId || null,
        eventId: eventId || null,
        isPinned: Boolean(isPinned)
      })

      res.status(201).json(announcement)
    } catch (err) {
      next(err)
    }
  },

  delete(req, res) {
    const { id } = req.params
    const success = db.deleteAnnouncement(id)
    if (!success) {
      return res.status(404).json({ error: 'NotFound', message: 'Announcement not found.' })
    }
    res.json({ message: 'Announcement deleted successfully.' })
  }
}
