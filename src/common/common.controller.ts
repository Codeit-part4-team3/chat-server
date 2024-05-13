import {
  Controller,
  Get,
  Inject,
  Injectable,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from '../auth/auth-guard';
import { ChannelService } from '../channel/channel.service';
import { ServerService } from '../server/server.service';
import { Logger } from 'winston';

@UseGuards(JwtAuthGuard)
@Injectable()
@Controller('chat/v1/common')
export class CommonController {
  constructor(
    private readonly serverService: ServerService,
    private readonly channelService: ChannelService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('allChannel')
  async getAllChannel(@Query('userId') userId: number) {
    const servers = await this.serverService.getAllServer(userId);

    const serverIds = servers.map((server) => server.id);
    return this.channelService.getAllChannelManyServer(serverIds);
  }
}
