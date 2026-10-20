import { Router } from 'express'
import { announcementsController } from './announcements.controller.js'
import { authenticate } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/roleGuard.js'

const router = Router()

router.get('/', announcementsController.list)
router.post('/', authenticate, requireRole(['COORDINATOR', 'ADMIN']), announcementsController.create)
router.delete('/:id', authenticate, requireRole(['COORDINATOR', 'ADMIN']), announcementsController.delete)

export default router
