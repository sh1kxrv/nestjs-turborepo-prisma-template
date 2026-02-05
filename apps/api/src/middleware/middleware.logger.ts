import { Injectable, Logger, type NestMiddleware } from '@nestjs/common'
import { getClientIp } from '@supercharge/request-ip'
import type { FastifyReply, FastifyRequest } from 'fastify'

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')

  use(
    request: FastifyRequest['raw'],
    response: FastifyReply['raw'],
    next: () => void,
  ): void {
    const { method, url } = request
    const userAgent = request.headers['user-agent'] || ''

    response.on('close', () => {
      const { statusCode } = response
      const contentLength = response.headersSent['content-length']

      const ip = getClientIp(request)

      this.logger.log(
        `${method} ${url}  ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      )
    })

    next()
  }
}
