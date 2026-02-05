import { SmtpService } from '#/module/smtp/smtp.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [SmtpService],
  exports: [SmtpService],
})
export class SmtpModule {}
