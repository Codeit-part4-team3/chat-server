import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChannelController } from './channel/channel.controller';
import { ChannelService } from './channel/channel.service';
import { ChannelModule } from './channel/channel.module';
import { PrismaService } from './prisma.service';
import { ServerModule } from './server/server.module';
import { ServerService } from './server/server.service';
import { ServerController } from './server/server.controller';

@Module({
  imports: [ChannelModule, ServerModule],
  controllers: [AppController, ServerController, ChannelController],
  providers: [AppService, ServerService, ChannelService, PrismaService],
})
export class AppModule {}
