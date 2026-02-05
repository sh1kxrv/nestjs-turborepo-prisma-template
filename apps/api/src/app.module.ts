import { HttpExceptionFilter } from '#/filter/filter.http-exception'
import { JwtAuthGuard } from '#/guard/guard.authorization'
import { ThrottlerBehindProxyGuard } from '#/guard/guard.throttler'
import { AppLoggerMiddleware } from '#/middleware/middleware.logger'
import { AuthModule } from '#/module/auth/module.auth'
import { SmtpModule } from '#/module/smtp/smtp.module'
import { UserModule } from '#/module/user/module.user'
import { CacheModule } from '@nestjs/cache-manager'
import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from '@repo/common'
import { ResponseInterceptor } from './interceptor/interceptor.response'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 15,
      },
      {
        name: '100_CALL_PER_MINUTE',
        ttl: 6e4,
        limit: 1e2,
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
  controllers: [],
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
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*path')
  }
}
