import { Router } from 'express'
import { adminController } from './admin.controller.js'
import { authenticate } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/roleGuard.js'

const router = Router()

// All admin routes require ADMIN role
router.use(authenticate, requireRole(['ADMIN']))

router.get('/analytics', adminController.analytics)
router.get('/users', adminController.listUsers)
router.patch('/users/:id/role', adminController.updateUserRole)
router.post('/coordinators', adminController.assignCoordinator)
router.delete('/coordinators/:id', adminController.removeCoordinator)

export default router
