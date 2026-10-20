import { Router } from 'express'
import { galleryController } from './gallery.controller.js'
import { authenticate } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/roleGuard.js'

const router = Router()

router.get('/', galleryController.list)
router.post('/', authenticate, requireRole(['ADMIN']), galleryController.create)
router.delete('/:id', authenticate, requireRole(['ADMIN']), galleryController.delete)

export default router
