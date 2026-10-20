import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { db } from '../db/prisma.js'

export function authenticate(req, res, next) {
  let token = null

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies && req.cookies.jyc_token) {
    token = req.cookies.jyc_token
  }

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token is missing. Please log in.'
    })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    const user = db.findUserById(decoded.userId)

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User account not found or has been deactivated.'
      })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: err.name === 'TokenExpiredError' ? 'Session expired. Please log in again.' : 'Invalid authentication token.'
    })
  }
}

export function optionalAuthenticate(req, res, next) {
  let token = null

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    req.user = null
    return next()
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = db.findUserById(decoded.userId) || null
  } catch {
    req.user = null
  }
  next()
}
