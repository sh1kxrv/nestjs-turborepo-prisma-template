import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto, PrismaService, UpdateUserDto } from '@repo/common'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
      },
    })
  }

  findAll() {
    return this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id)
    return this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
      },
    })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    })
  }
}
