import { UserPayload } from '#/decorator/decorator.jwt-payload'
import { Public } from '#/decorator/decorator.public-route'
import { AuthService } from '#/module/auth/service.auth'
import type { PayloadJwtUser } from '#/types/type.user'
import { Body, Controller, Post, Res } from '@nestjs/common'
import {
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AuthConfirmCodeDto, AuthRequestCodeDto } from '@repo/common'
import type { FastifyReply } from 'fastify'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('request-code')
  @ApiOperation({
    summary: 'Request email verification code',
    description:
      'Sends a verification code to the email. Returns a token for confirmation.',
  })
  @ApiBody({ type: AuthRequestCodeDto })
  @ApiOkResponse({
    description: 'Code sent. Returns token for confirmation.',
  })
  async requestCode(@Body() dto: AuthRequestCodeDto) {
    return this.authService.requestEmailCode(dto.email)
  }

  @Public()
  @Post('confirm-code')
  @ApiOperation({
    summary: 'Confirm email code and get JWT',
    description: 'Confirms the code and sets JWT in httpOnly cookie.',
  })
  @ApiBody({ type: AuthConfirmCodeDto })
  @ApiOkResponse({
    description: 'JWT set in cookie. Returns { result: true }.',
  })
  async confirmCode(
    @Body() dto: AuthConfirmCodeDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { token, expiresIn } = await this.authService.confirmEmailCode(
      dto.token,
      dto.code,
    )

    reply.setCookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      expires: new Date(expiresIn),
    })

    return { result: true }
  }

  @Post('refresh')
  @ApiCookieAuth('token')
  @ApiOperation({
    summary: 'Refresh JWT',
    description: 'Requires auth cookie. Issues new JWT and updates cookie.',
  })
  @ApiOkResponse({
    description: 'JWT refreshed. Returns { result: true }.',
  })
  @ApiUnauthorizedResponse({
    description: 'No cookie or invalid JWT.',
  })
  async refresh(
    @UserPayload() payload: PayloadJwtUser,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { token, expiresIn } = await this.authService.refresh(payload)

    reply.setCookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      expires: new Date(expiresIn),
    })

    return { result: true }
  }
}
