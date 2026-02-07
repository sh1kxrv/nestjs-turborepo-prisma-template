import { describe, expect, it } from 'vitest'

describe('e2e infrastructure health', () => {
  it('postgres is reachable via prisma', async () => {
    const { PrismaClient } = await import('@prisma/client')
    const { PrismaPg } = await import('@prisma/adapter-pg')

    const adapter = new PrismaPg({
      connectionString: process.env.DB_URL,
    })
    const prisma = new PrismaClient({ adapter })

    try {
      await prisma.$connect()
      const result = await prisma.$queryRaw`SELECT 1 as health`
      expect(result).toBeDefined()
    } finally {
      await prisma.$disconnect()
    }
  })
})
