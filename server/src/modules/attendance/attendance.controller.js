import { db } from '../../db/prisma.js'

export const attendanceController = {
  mark(req, res, next) {
    try {
      const { eventId } = req.params
      const { registrationId, status, batch } = req.body

      const event = db.findEventById(eventId)
      if (!event) {
        return res.status(404).json({ error: 'NotFound', message: 'Event not found.' })
      }

      // Check coordinator authorization
      if (req.user.role === 'COORDINATOR') {
        const isAssigned = db.isUserCoordinatorForHub(req.user.id, event.hubId)
        if (!isAssigned) {
          return res.status(403).json({
            error: 'Forbidden',
            message: 'You can only mark attendance for events hosted by your assigned hub.'
          })
        }
      }

      if (Array.isArray(batch)) {
        const results = batch.map((item) =>
          db.markAttendance(eventId, item.registrationId, item.status, req.user.id)
        )
        return res.json({ message: 'Batch attendance updated successfully.', results })
      }

      if (!registrationId || !status) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'registrationId and status (PRESENT/ABSENT) are required.'
        })
      }

      const attendance = db.markAttendance(eventId, registrationId, status, req.user.id)
      res.json({ message: 'Attendance marked successfully.', attendance })
    } catch (err) {
      next(err)
    }
  }
}
