import { Injectable } from '@nestjs/common'
import { JwtService as NestJwtService } from '@nestjs/jwt'

@Injectable()
export class JwtService {
  constructor(private readonly lws: NestJwtService) {}

  private ms(ms: string) {
    const match = /^(\d+)([smhdwy])$/.exec(ms)
    if (!match) {
      return 86400000
    }
    const value = Number.parseInt(match[1], 10)
    switch (match[2]) {
      case 's':
        return value * 1000
      case 'm':
        return value * 60000
      case 'h':
        return value * 3600000
      case 'd':
        return value * 86400000
      case 'w':
        return value * 604800000
      case 'y':
        return value * 31557600000
      default:
        return 86400000
    }
  }

  async sign(data: any, expiresIn: string, secret: string) {
    const expiresInMs = this.ms(expiresIn)
    const isoDateExpires = new Date(Date.now() + expiresInMs).toISOString()

    const token = await this.lws.signAsync(data, {
      secret,
      expiresIn: expiresInMs,
    })

    return {
      token: token,
      expiresIn: isoDateExpires,
    }
  }

  async signWithRefresh(
    data: any,
    secret: string,
    refreshSecret: string,
    expiresIn: string,
    expiresInRefresh: string,
  ) {
    const { expiresIn: accessExpiresIn, token: accessToken } = await this.sign(
      data,
      expiresIn,
      secret,
    )
    const { expiresIn: refreshExpiresIn, token: refreshToken } =
      await this.sign(data, expiresInRefresh, refreshSecret)

    return {
      accessToken,
      refreshToken,
      accessExpiresIn,
      refreshExpiresIn,
    }
  }
}
