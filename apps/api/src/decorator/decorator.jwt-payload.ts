import type { PayloadJwtUser } from '#/types/type.user'
import { createParamDecorator, type ExecutionContext } from '@nestjs/common'

export const UserPayload = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return (request.userPayload as PayloadJwtUser) ?? null
  },
)
