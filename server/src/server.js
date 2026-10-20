import app from './app.js'
import { config } from './config/env.js'

const server = app.listen(config.port, () => {
  console.log(`===============================================`)
  console.log(`🚀 JYC Connect API Server running`)
  console.log(`   Port:     ${config.port}`)
  console.log(`   Env:      ${config.nodeEnv}`)
  console.log(`   Health:   http://localhost:${config.port}/health`)
  console.log(`   API v1:   http://localhost:${config.port}/api/v1`)
  console.log(`===============================================`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.')
  server.close(() => {
    console.log('Process terminated.')
  })
})
