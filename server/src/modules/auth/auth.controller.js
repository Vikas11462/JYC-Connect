import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { config } from '../../config/env.js'
import { db } from '../../db/prisma.js'

function generateToken(userId, role) {
  return jwt.sign({ userId, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  })
}

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user
  return safe
}

export const authController = {
  async register(req, res, next) {
    try {
      const { email, password, name, rollNumber, department, yearOfStudy, phone } = req.body

      if (!email || !password || !name) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'Email, password, and name are required fields.'
        })
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'Please provide a valid email address.'
        })
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'Password must be at least 6 characters long.'
        })
      }

      const existingUser = db.findUserByEmail(email)
      if (existingUser) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'An account with this email address already exists.'
        })
      }

      const passwordHash = await bcrypt.hash(password, 10)

      // PUBLIC REGISTRATION ALWAYS CREATES STUDENT ACCOUNTS
      const newUser = db.createUser({
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name.trim(),
        rollNumber: rollNumber ? rollNumber.trim() : null,
        department: department ? department.trim() : null,
        yearOfStudy: yearOfStudy ? parseInt(yearOfStudy, 10) : null,
        phone: phone ? phone.trim() : null,
        role: 'STUDENT'
      })

      const token = generateToken(newUser.id, newUser.role)

      res.status(201).json({
        message: 'Account registered successfully.',
        token,
        user: sanitizeUser(newUser)
      })
    } catch (err) {
      next(err)
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'Please provide both email and password.'
        })
      }

      const user = db.findUserByEmail(email)
      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password.'
        })
      }

      if (!user.isActive) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Your account has been deactivated. Please contact support.'
        })
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash)
      if (!isMatch) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password.'
        })
      }

      const fullUser = db.findUserById(user.id)
      const token = generateToken(user.id, user.role)

      res.json({
        message: 'Logged in successfully.',
        token,
        user: sanitizeUser(fullUser)
      })
    } catch (err) {
      next(err)
    }
  },

  async me(req, res) {
    res.json({
      user: sanitizeUser(req.user)
    })
  },

  async logout(req, res) {
    res.json({ message: 'Logged out successfully.' })
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body
      if (email) {
        const user = db.findUserByEmail(email)
        if (user) {
          const rawToken = crypto.randomBytes(32).toString('hex')
          const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
          const expiresAt = new Date(Date.now() + 3600000) // 1 hour
          db.createPasswordResetToken(user.id, tokenHash, expiresAt)
          // In production, send email with rawToken
        }
      }

      // Security requirement: generic response that never leaks whether the account exists
      res.json({
        message: 'If an account matches that email, a password reset link has been dispatched.'
      })
    } catch (err) {
      next(err)
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body
      if (!token || !newPassword || newPassword.length < 6) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'Valid token and new password (min 6 characters) are required.'
        })
      }

      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
      const resetToken = db.findValidResetToken(tokenHash)

      if (!resetToken) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'Password reset token is invalid or has expired.'
        })
      }

      const passwordHash = await bcrypt.hash(newPassword, 10)
      db.updateUser(resetToken.userId, { passwordHash })
      db.markResetTokenUsed(resetToken.id)

      res.json({ message: 'Your password has been successfully reset. You may now log in.' })
    } catch (err) {
      next(err)
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { name, phone, department, yearOfStudy } = req.body
      const updated = db.updateUser(req.user.id, {
        ...(name ? { name: name.trim() } : {}),
        ...(phone ? { phone: phone.trim() } : {}),
        ...(department ? { department: department.trim() } : {}),
        ...(yearOfStudy ? { yearOfStudy: parseInt(yearOfStudy, 10) } : {})
      })
      res.json({ message: 'Profile updated successfully.', user: sanitizeUser(updated) })
    } catch (err) {
      next(err)
    }
  }
}
