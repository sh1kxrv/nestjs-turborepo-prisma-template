import { JwtService } from '#/module/jwt/jwt.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
