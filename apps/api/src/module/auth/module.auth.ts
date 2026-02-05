import { AuthController } from '#/module/auth/controller.auth'
import { AuthService } from '#/module/auth/service.auth'
import { JwtModule } from '#/module/jwt/jwt.module'
import { SmtpModule } from '#/module/smtp/smtp.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [JwtModule, SmtpModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
