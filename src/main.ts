import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useLogger(logger);
  logger.info('Application started');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: ['https://pqsoft.net', 'https://api.pqsoft.net'],
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    allowedHeaders:
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(80);
  logger.info('Application listening on port 80');
}
bootstrap();
