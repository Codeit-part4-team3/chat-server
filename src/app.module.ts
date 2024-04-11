import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChannelController } from './channel/channel.controller';
import { ChannelService } from './channel/channel.service';
import { ChannelModule } from './channel/channel.module';
import { SubController } from './sub/sub.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ChannelModule],
  controllers: [SubController, AppController, ChannelController],
  providers: [AppService, ChannelService, PrismaService],
})
export class AppModule {}
