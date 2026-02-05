import { JwtService } from '#/module/jwt/jwt.service'
import { SmtpService } from '#/module/smtp/smtp.service'
import type { PayloadJwtUser } from '#/types/type.user'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@repo/common'
import type { Cache } from 'cache-manager'
import { randomInt } from 'crypto'
import hyperid from 'hyperid'

type EmailAuthCache = {
  email: string
  code: string
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly jwt: JwtService,
    private readonly smtp: SmtpService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async requestEmailCode(email: string) {
    const hyperId = hyperid()
    const code = this.generateCode()
    const token = hyperId()
    const ttlMs = 10 * 60 * 1000

    await this.cache.set(
      `auth:email:${token}`,
      { email, code } satisfies EmailAuthCache,
      ttlMs,
    )

    try {
      await this.smtp.sendMail(
        email,
        'Email confirmation',
        `<p>Your confirmation code: <strong>${code}</strong></p>`,
      )
    } catch (error) {
      this.logger.warn(
        `Failed to send email to ${email}: ${(error as Error).message}`,
      )
    }

    return { token }
  }

  async confirmEmailCode(token: string, code: string) {
    const cached = await this.cache.get<EmailAuthCache>(`auth:email:${token}`)
    if (!cached || cached.code !== code) {
      throw new BadRequestException('Invalid confirmation token or code')
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        email: cached.email,
      },
    })

    const user = existing
      ? await this.prisma.user.update({
          where: { id: existing.id },
          data: { isActive: true },
        })
      : await this.prisma.user.create({
          data: {
            email: cached.email,
            isActive: true,
          },
        })

    await this.cache.del(`auth:email:${token}`)

    const payload: PayloadJwtUser = {
      userId: user.id,
      email: user.email,
    }
    return this.signJwt(payload)
  }

  async refresh(payload: PayloadJwtUser) {
    return this.signJwt({
      userId: payload.userId,
      email: payload.email,
    })
  }

  private async signJwt(payload: PayloadJwtUser) {
    const secret = this.config.get<string>('JWT_SECRET')
    if (!secret) {
      throw new BadRequestException('JWT_SECRET not configured')
    }
    const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') ?? '7d'
    return this.jwt.sign(payload, expiresIn, secret)
  }

  private generateCode() {
    return randomInt(100000, 900000) + ''
  }
}
