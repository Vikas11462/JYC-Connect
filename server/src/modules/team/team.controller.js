import { db } from '../../db/prisma.js'

export const teamController = {
  list(req, res) {
    const list = db.listTeam()
    res.json(list)
  },

  create(req, res, next) {
    try {
      const { name, role, hubName, bio, avatarUrl, isCore } = req.body
      if (!name || !role) {
        return res.status(400).json({ error: 'BadRequest', message: 'Name and role are required.' })
      }
      const member = db.createTeamMember({
        name,
        role,
        hubName: hubName || null,
        bio: bio || '',
        avatarUrl: avatarUrl || null,
        isCore: Boolean(isCore)
      })
      res.status(201).json(member)
    } catch (err) {
      next(err)
    }
  },

  delete(req, res) {
    const { id } = req.params
    const success = db.deleteTeamMember(id)
    if (!success) {
      return res.status(404).json({ error: 'NotFound', message: 'Team member not found.' })
    }
    res.json({ message: 'Team member deleted successfully.' })
  }
}
