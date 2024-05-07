import {
  Inject,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Injectable,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateChannelDto, PatchChannelDto } from '../entities/channel.dto';
import { ChannelService } from './channel.service';
import { Channel, UserChannel } from '@prisma/client';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from '../auth/auth-guard';

//
// # 체널 관련 API
//
// ## 전체 체널 리스트 조회 GET /channel/all
// ## 체널 생성 POST /channel
// ## 체널 수정 PUT /channel/:id
// ## 체널 삭제 DELETE /channel/:id
// ## 특정 체널 구성원 조회 GET /channel/:id
//

@UseGuards(JwtAuthGuard)
@Injectable()
@Controller('chat/v1/server/:serverId/channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('all')
  @HttpCode(200)
  async getAllRequest(
    @Param('serverId') serverId: number,
    @Query('userId') userId: number,
  ): Promise<Channel[]> {
    return this.channelService.getAllChannel(userId, serverId);
  }

  @Get(':id')
  @HttpCode(200)
  async GetChannelRequest(@Param('id') id: number): Promise<Channel> {
    return this.channelService.getChannel(id);
  }

  // TODO : 체널 생성시 해당 유저와 연결

  @Post()
  @HttpCode(201)
  async postRequest(
    @Body() createChannelDto: CreateChannelDto,
    @Param('serverId') serverId: number,
    @Query('userId') userId: number,
  ): Promise<Channel> {
    return this.channelService
      .createChannel(serverId, createChannelDto)
      .then((channel) => {
        this.channelService.createUserLinkChannel(channel.id, userId);
        return channel;
      });
  }

  @Get(':id/users')
  @HttpCode(200)
  async getUsersRequest(@Param('id') id: number): Promise<UserChannel[]> {
    return this.channelService.getAllUserIncludeChannel(id);
  }

  @Patch(':id')
  async patchRequest(
    @Param('id') id: number,
    @Body() patchChannelDto: PatchChannelDto,
  ): Promise<Channel> {
    return this.channelService.patchChannel(id, patchChannelDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteRequest(@Param('id') id: number): Promise<void> {
    this.channelService.deleteChannel(id);
  }
}
