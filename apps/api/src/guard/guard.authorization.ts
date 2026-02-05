import { IS_PUBLIC_KEY } from '#/decorator/decorator.public-route'
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { type FastifyRequest } from 'fastify'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cfg: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<
        FastifyRequest & { cookies?: Record<string, string | undefined> }
      >()

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const rawToken = req.cookies?.token
    if (!rawToken) throw new UnauthorizedException()

    try {
      const secret = this.cfg.get<string>('JWT_SECRET')

      const payload = await this.jwtService.verifyAsync(rawToken, {
        secret,
      })
      req.userPayload = payload

      return true
    } catch {
      throw new UnauthorizedException()
    }
  }
}
