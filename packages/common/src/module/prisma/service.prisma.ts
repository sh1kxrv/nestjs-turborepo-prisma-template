import { Injectable } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const url = process.env.DB_URL
    const adapter = new PrismaPg({
      connectionString: url,
    })
    super({ adapter })
  }
}
