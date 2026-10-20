import { Router } from 'express'
import { teamController } from './team.controller.js'
import { authenticate } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/roleGuard.js'

const router = Router()

router.get('/', teamController.list)
router.post('/', authenticate, requireRole(['ADMIN']), teamController.create)
router.delete('/:id', authenticate, requireRole(['ADMIN']), teamController.delete)

export default router
