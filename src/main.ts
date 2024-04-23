import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
  const logger = new Logger('ChatServer');

  logger.log('Starting the application');
  const app = await NestFactory.create(AppModule);
  logger.log('Application started');

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
  logger.log('ValidationPipe set');

  app.enableCors({
    origin: 'https://api.pqsoft.net',
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  logger.log('PrismaClientExceptionFilter set');

  await app.listen(80);
  logger.log('Application listening on port 80');
}
bootstrap();
