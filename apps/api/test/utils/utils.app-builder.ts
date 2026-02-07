import { HttpExceptionFilter } from '#/filter/filter.http-exception'
import { JwtAuthGuard } from '#/guard/guard.authorization'
import { ThrottlerBehindProxyGuard } from '#/guard/guard.throttler'
import { ResponseInterceptor } from '#/interceptor/interceptor.response'
import { AuthModule } from '#/module/auth/module.auth'
import { SmtpModule } from '#/module/smtp/smtp.module'
import { UserModule } from '#/module/user/module.user'
import fastifyCookie from '@fastify/cookie'
import { PrismaModule, PrismaService } from '@repo/common'
import { CacheModule } from '@nestjs/cache-manager'
import { ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { ThrottlerModule } from '@nestjs/throttler'

export const buildE2eApp = async () => {
  const adapter = new FastifyAdapter({
    trustProxy: true,
  })

  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      PrismaModule,
      ThrottlerModule.forRoot([
        {
          name: 'default',
          ttl: 1,
          limit: 99999,
        },
        {
          name: '100_CALL_PER_MINUTE',
          ttl: 1,
          limit: 9999,
        },
      ]),
      JwtModule.register({
        signOptions: {},
        global: true,
      }),
      CacheModule.register({
        isGlobal: true,
        max: 1e3,
      }),
      SmtpModule,
      AuthModule,
      UserModule,
    ],
    providers: [
      {
        provide: APP_FILTER,
        useClass: HttpExceptionFilter,
      },
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },
      {
        provide: APP_INTERCEPTOR,
        useClass: ResponseInterceptor,
      },
      {
        provide: APP_GUARD,
        useClass: ThrottlerBehindProxyGuard,
      },
    ],
  }).compile()

  const prisma = moduleRef.get(PrismaService)

  // Clean up tables before tests
  // Order matters due to foreign key constraints
  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users" CASCADE`)
  } catch (error) {
    console.warn('[E2E Setup] Table cleanup warning:', (error as Error).message)
  }

  const app = moduleRef.createNestApplication<NestFastifyApplication>(adapter, {
    logger: ['error', 'warn'],
  })

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest',
  })

  app.setGlobalPrefix('/api/v1')

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipUndefinedProperties: false,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  )

  await app.init()

  const fastify = app.getHttpAdapter().getInstance()
  await fastify.ready()

  return { app, fastify, prisma }
}
