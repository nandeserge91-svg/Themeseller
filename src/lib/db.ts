import { PrismaClient } from '@prisma/client'

// Évite multiple instances en développement
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Vérifier si DATABASE_URL est configuré
const isDatabaseConfigured = !!process.env.DATABASE_URL && 
  !process.env.DATABASE_URL.includes('user:password')

let prismaInstance: PrismaClient | null = null

if (isDatabaseConfigured) {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance
  }
}

export const prisma = prismaInstance as PrismaClient
export const isDatabaseAvailable = isDatabaseConfigured

export default prisma

