import { db } from '../db/prisma.js'

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required.'
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}.`
      })
    }

    next()
  }
}

export function requireHubAccess(getHubIdFn) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required.' })
    }

    // Admins have platform-wide access to every hub
    if (req.user.role === 'ADMIN') {
      return next()
    }

    if (req.user.role !== 'COORDINATOR') {
      return res.status(403).json({ error: 'Forbidden', message: 'Coordinator permissions required.' })
    }

    const hubId = getHubIdFn(req)
    if (!hubId) {
      return res.status(400).json({ error: 'Bad Request', message: 'Hub identification missing.' })
    }

    const isAssigned = db.isUserCoordinatorForHub(req.user.id, hubId)
    if (!isAssigned) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not an authorized coordinator for this hub.'
      })
    }

    next()
  }
}
