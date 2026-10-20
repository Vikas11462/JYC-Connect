import { Router } from 'express'
import { eventsController } from './events.controller.js'
import { authenticate, optionalAuthenticate } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/roleGuard.js'

const router = Router()

router.get('/', eventsController.list)
router.get('/:id', optionalAuthenticate, eventsController.get)
router.post('/', authenticate, requireRole(['COORDINATOR', 'ADMIN']), eventsController.create)
router.patch('/:id', authenticate, requireRole(['COORDINATOR', 'ADMIN']), eventsController.update)
router.post('/:id/register', authenticate, eventsController.register)
router.post('/:id/cancel', authenticate, eventsController.cancelRegistration)
router.get('/:id/registrations', authenticate, requireRole(['COORDINATOR', 'ADMIN']), eventsController.getRegistrations)

export default router
