import { PrismaClient } from '@prisma/client'
import { config } from '../config/env.js'
import { dataStore } from './store.js'

let prismaInstance = null

export function getPrisma() {
  if (!prismaInstance && config.databaseUrl) {
    try {
      prismaInstance = new PrismaClient()
    } catch {
      // Prisma Client not generated or DB not reachable
      prismaInstance = null
    }
  }
  return prismaInstance
}

// Export the primary transactional repository
export const db = dataStore
