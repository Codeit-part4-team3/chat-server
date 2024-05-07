import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChannelController } from './channel/channel.controller';
import { ChannelService } from './channel/channel.service';
import { ChannelModule } from './channel/channel.module';
import { PrismaService } from './prisma.service';
import { ServerModule } from './server/server.module';
import { ServerService } from './server/server.service';
import { ServerController } from './server/server.controller';
import { LoggerModule } from './common/logger/logger.module';
import { LoggingMiddleware } from './common/logger/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ChannelModule,
    ServerModule,
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    ServerController,
    ChannelController,
    AuthController,
  ],
  providers: [
    AppService,
    ServerService,
    ChannelService,
    PrismaService,
    AuthService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // 모든 라우트에 미들웨어를 적용
  }
}
