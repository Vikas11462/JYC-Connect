import { Router } from 'express'
import { attendanceController } from './attendance.controller.js'
import { authenticate } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/roleGuard.js'

const router = Router()

router.post('/:eventId/mark', authenticate, requireRole(['COORDINATOR', 'ADMIN']), attendanceController.mark)

export default router
