import type { PayloadJwtUser } from '#/types/type.user'
import '@fastify/cookie'
import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    userPayload?: PayloadJwtUser
    cookies?: Record<string, string | undefined>
  }

  interface FastifyReply {
    setCookie(
      name: string,
      value: string,
      options?: {
        httpOnly?: boolean
        sameSite?: 'strict' | 'lax' | 'none'
        path?: string
        expires?: Date
        maxAge?: number
        secure?: boolean
        domain?: string
      },
    ): this
    clearCookie(
      name: string,
      options?: { path?: string; domain?: string },
    ): this
  }
}
