import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport, type Transporter } from 'nodemailer'

@Injectable()
export class SmtpService {
  private readonly transporter: Transporter
  private readonly transporterCustomer: Transporter

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST') ?? 'localhost'
    const port = this.readNumber(this.config.get<string>('SMTP_PORT'), 1025)
    const secure = this.readBoolean(
      this.config.get<string>('SMTP_SECURE'),
      false,
    )
    const user = this.config.get<string>('SMTP_USER')
    const pass = this.config.get<string>('SMTP_PASS')

    this.transporter = this.createTransporter({
      host,
      port,
      secure,
      user,
      pass,
    })

    const feedbackHost = this.config.get<string>('SMTP_FEEDBACK_HOST') ?? host
    const feedbackPort = this.readNumber(
      this.config.get<string>('SMTP_FEEDBACK_PORT') ??
        this.config.get<string>('SMTP_PORT'),
      port,
    )
    const feedbackSecure = this.readBoolean(
      this.config.get<string>('SMTP_FEEDBACK_SECURE') ??
        this.config.get<string>('SMTP_SECURE'),
      secure,
    )
    const feedbackUser = this.config.get<string>('SMTP_FEEDBACK_USER')
    const feedbackPass = this.config.get<string>('SMTP_FEEDBACK_PASS')

    this.transporterCustomer = this.createTransporter({
      host: feedbackHost,
      port: feedbackPort,
      secure: feedbackSecure,
      user: feedbackUser,
      pass: feedbackPass,
    })
  }

  sendMail(address: string, subject: string, template: string) {
    return this.transporter.sendMail({
      from: this.config.get<string>('SMTP_USER'),
      to: address,
      subject,
      html: template,
    })
  }

  sendMailAsCustomer(address: string, subject: string, template: string) {
    return this.transporterCustomer.sendMail({
      from: this.config.get<string>('SMTP_FEEDBACK_USER'),
      to: address,
      subject,
      html: template,
    })
  }

  private createTransporter(options: {
    host: string
    port: number
    secure: boolean
    user?: string
    pass?: string
  }) {
    const auth =
      options.user && options.pass
        ? { user: options.user, pass: options.pass }
        : undefined

    return createTransport({
      host: options.host,
      port: options.port,
      secure: options.secure,
      auth,
    })
  }

  private readNumber(value: string | undefined, defaultValue: number) {
    const parsed = value ? Number(value) : Number.NaN

    return Number.isFinite(parsed) ? parsed : defaultValue
  }

  private readBoolean(value: string | undefined, defaultValue: boolean) {
    if (value === undefined) {
      return defaultValue
    }

    return value.toLowerCase() === 'true'
  }
}
