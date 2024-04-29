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
} from '@nestjs/common';
import {
  CreateChannelDto,
  PactchChannelDto as PatchChannelDto,
} from '../entities/channel.dto';
import { ChannelService } from './channel.service';
import { Channel, UserChannel } from '@prisma/client';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

//
// # 체널 관련 API
//
// ## 전체 체널 리스트 조회 GET /channel/all
// ## 체널 생성 POST /channel
// ## 체널 수정 PUT /channel/:id
// ## 체널 삭제 DELETE /channel/:id
// ## 특정 체널 구성원 조회 GET /channel/:id
//

@Injectable()
@Controller('chat/v1/channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('all')
  @HttpCode(200)
  async getAllRequest(): Promise<Channel[]> {
    this.logger.info('[controller] Get /chat/v1/channel/all');
    return this.channelService.getAllChannel();
  }
  @Post()
  @HttpCode(201)
  async postRequest(
    @Body() createChannelDto: CreateChannelDto,
  ): Promise<Channel> {
    this.logger.info('[controller] Post /chat/v1/channel');
    return this.channelService.createChannel(createChannelDto);
  }
  @Get(':id/users')
  @HttpCode(200)
  async getUsersRequest(@Param('id') id: number): Promise<UserChannel[]> {
    this.logger.info('[controller] Get /chat/v1/channel/:id/users');
    return this.channelService.getAllUserIncludeChannel(id);
  }
  @Patch(':id')
  @HttpCode(200)
  async patchRequest(
    @Param('id') id: number,
    @Body() patchChannelDto: PatchChannelDto,
  ): Promise<Channel> {
    this.logger.info('[controller] Patch /chat/v1/channel/:id');
    return this.channelService.patchChannel(id, patchChannelDto);
  }
  @Delete(':id')
  @HttpCode(200)
  async deleteRequest(@Param('id') id: number): Promise<Channel> {
    this.logger.info('[controller] Delete /chat/v1/channel/:id');
    return this.channelService.deleteChannel(id);
  }
}
