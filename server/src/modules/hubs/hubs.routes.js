import { Router } from 'express'
import { hubsController } from './hubs.controller.js'
import { authenticate } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/roleGuard.js'

const router = Router()

router.get('/', hubsController.list)
router.get('/:slug', hubsController.get)
router.post('/', authenticate, requireRole(['ADMIN']), hubsController.create)
router.patch('/:slug', authenticate, requireRole(['ADMIN']), hubsController.update)

export default router
