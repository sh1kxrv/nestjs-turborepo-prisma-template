import {
  type ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import type { FastifyReply } from 'fastify'

@Catch()
export class HttpExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    const errorResponse =
      exception instanceof HttpException ? exception.getResponse() : null

    const errorMessage = this.resolveMessage(errorResponse, exception)

    response.status(status).send({
      status: false,
      errorCode: status,
      errorMessage,
    })
  }

  private resolveMessage(errorResponse: unknown, exception: unknown): string {
    if (typeof errorResponse === 'string') {
      return errorResponse
    }
    if (
      errorResponse &&
      typeof errorResponse === 'object' &&
      'message' in errorResponse
    ) {
      const message = (errorResponse as { message?: string | string[] }).message
      if (Array.isArray(message)) {
        return message.join('; ')
      }
      if (typeof message === 'string') {
        return message
      }
    }
    if (exception instanceof Error) {
      return exception.message
    }
    return 'Unexpected error'
  }
}
