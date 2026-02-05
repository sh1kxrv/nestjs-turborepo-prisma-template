import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AppModule } from './app.module'

async function bootstrap() {
  const origin = ['http://localhost:808']
  const fastify = new FastifyAdapter({
    trustProxy: true,
  })

  fastify.enableCors({
    origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastify,
    {
      logger: ['debug', 'log', 'warn', 'error'],
      rawBody: true,
      forceCloseConnections: true,
    },
  )

  // NOTE: If you have problems with the following lines about types, check compatibility with the fastify-plugin and fastify
  // Also try re-install node_modules & pnpm-lock.yaml
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest',
  })
  await app.register(fastifyMultipart)

  app.setGlobalPrefix('/api/v1')

  const config = new DocumentBuilder()
    .setTitle('Template | API')
    .setDescription('Documentation for API')
    .setVersion('0.0.1')
    .addTag('REST API')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  // Scalar API Reference
  app.use(
    '/reference',

    apiReference({
      content: document,
      withFastify: true,
    }),
  )

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipUndefinedProperties: false,
      transformOptions: {
        // Otherwise @IsString() will pass after conversion (e.g. 123 -> "123").
        enableImplicitConversion: false,
      },
    }),
  )

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
