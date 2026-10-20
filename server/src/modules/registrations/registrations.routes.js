import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { db } from '../../db/prisma.js'

const router = Router()

router.get('/my', authenticate, (req, res) => {
  const registrations = db.getUserRegistrations(req.user.id)
  res.json(registrations)
})

export default router
