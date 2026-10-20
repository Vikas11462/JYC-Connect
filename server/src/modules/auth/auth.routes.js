import { Router } from 'express'
import { authController } from './auth.controller.js'
import { authenticate } from '../../middleware/auth.js'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/me', authenticate, authController.me)
router.patch('/profile', authenticate, authController.updateProfile)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

export default router
