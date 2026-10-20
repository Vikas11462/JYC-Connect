import { db } from '../../db/prisma.js'

export const adminController = {
  analytics(req, res) {
    const stats = db.getPlatformAnalytics()
    res.json(stats)
  },

  listUsers(req, res) {
    const { search, role } = req.query
    const users = db.listUsers({ search, role })
    res.json(users)
  },

  updateUserRole(req, res, next) {
    try {
      const { id } = req.params
      const { role } = req.body

      if (!['STUDENT', 'COORDINATOR', 'ADMIN'].includes(role)) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'Role must be STUDENT, COORDINATOR, or ADMIN.'
        })
      }

      const updated = db.updateUser(id, { role })
      if (!updated) {
        return res.status(404).json({ error: 'NotFound', message: 'User not found.' })
      }

      const { passwordHash, ...safe } = updated
      res.json({ message: 'User role updated successfully.', user: safe })
    } catch (err) {
      next(err)
    }
  },

  assignCoordinator(req, res, next) {
    try {
      const { userId, hubId } = req.body
      if (!userId || !hubId) {
        return res.status(400).json({ error: 'BadRequest', message: 'userId and hubId are required.' })
      }

      const assignment = db.assignCoordinator(userId, hubId)
      res.status(201).json({ message: 'Coordinator assigned successfully.', assignment })
    } catch (err) {
      next(err)
    }
  },

  removeCoordinator(req, res, next) {
    try {
      const { id } = req.params
      const success = db.removeCoordinator(id)
      if (!success) {
        return res.status(404).json({ error: 'NotFound', message: 'Coordinator assignment not found.' })
      }
      res.json({ message: 'Coordinator assignment removed.' })
    } catch (err) {
      next(err)
    }
  }
}
