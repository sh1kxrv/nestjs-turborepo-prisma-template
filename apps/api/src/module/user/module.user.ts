import { UserController } from '#/module/user/controller.user'
import { UserService } from '#/module/user/service.user'
import { Module } from '@nestjs/common'

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
