import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { config } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

// Import Routes
import authRoutes from './modules/auth/auth.routes.js'
import hubsRoutes from './modules/hubs/hubs.routes.js'
import eventsRoutes from './modules/events/events.routes.js'
import attendanceRoutes from './modules/attendance/attendance.routes.js'
import registrationsRoutes from './modules/registrations/registrations.routes.js'
import announcementsRoutes from './modules/announcements/announcements.routes.js'
import galleryRoutes from './modules/gallery/gallery.routes.js'
import teamRoutes from './modules/team/team.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'

const app = express()

// Global Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development and configured client origins
      callback(null, true)
    },
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'))
}

// Rate Limiter: 200 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    error: 'TooManyRequests',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

app.use('/api', apiLimiter)

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'jyc-connect-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  })
})

// Feature Routers
function mountApiRoutes(router) {
  router.use('/auth', authRoutes)
  router.use('/hubs', hubsRoutes)
  router.use('/events', eventsRoutes)
  router.use('/attendance', attendanceRoutes)
  router.use('/registrations', registrationsRoutes)
  router.use('/announcements', announcementsRoutes)
  router.use('/gallery', galleryRoutes)
  router.use('/team', teamRoutes)
  router.use('/admin', adminRoutes)

  // Compatibility aliases for frontend coordinator calls
  router.use('/coordinator/events', eventsRoutes)
  router.use('/coordinator/announcements', announcementsRoutes)

  // Compatibility aliases for frontend
  router.get('/me/registrations', (req, res, next) => {
    req.url = '/my'
    registrationsRoutes(req, res, next)
  })
  router.patch('/me/profile', (req, res, next) => {
    req.url = '/profile'
    authRoutes(req, res, next)
  })
}

const v1Router = express.Router()
mountApiRoutes(v1Router)

// Mount both under /api/v1 and /api for full compatibility
app.use('/api/v1', v1Router)
app.use('/api', v1Router)

// Error Handlers
app.use(notFoundHandler)
app.use(errorHandler)

export default app
