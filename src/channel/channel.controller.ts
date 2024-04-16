import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Injectable,
} from '@nestjs/common';
import {
  CreateChannelDto,
  PactchChannelDto as PatchChannelDto,
} from 'src/entities/channel.dto';
import { ChannelService } from './channel.service';
import { Channel, UserChannel } from '@prisma/client';

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
@Controller('api/chat/v1/channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('all')
  async GetAllRequest(): Promise<Channel[]> {
    return this.channelService.getAllChannel();
  }
  @Post()
  async PostRequest(
    @Body() createChannelDto: CreateChannelDto,
  ): Promise<Channel> {
    return this.channelService.createChannel(createChannelDto);
  }
  @Get(':id/users')
  async GetUsersRequest(@Param('id') id: number): Promise<UserChannel[]> {
    return this.channelService.getAllUserIncludeChannel(id);
  }
  @Patch(':id')
  async PatchRequest(
    @Param('id') id: number,
    @Body() patchChannelDto: PatchChannelDto,
  ): Promise<Channel> {
    return this.channelService.patchChannel(id, patchChannelDto);
  }
  @Delete(':id')
  async DeleteRequest(@Param('id') id: number): Promise<Channel> {
    return this.channelService.deleteChannel(id);
  }
}
