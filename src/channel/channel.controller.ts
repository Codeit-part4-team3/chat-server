import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Put,
  Injectable,
} from '@nestjs/common';
import { CreateChannelDto } from 'src/entities/createChannel.dto';
import { ChannelService } from './channel.service';
import { Channel } from '@prisma/client';

//
// # 체널 관련 API
//
// ## 전체 체널 리스트 조회 GET /channel/all
// ## 체널 생성 POST /channel
// ## 특정 체널 조회 GET /channel/:id
// ## 체널 수정 PUT /channel/:id
// ## 체널 삭제 DELETE /channel/:id
//

@Injectable()
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('all')
  async GetAllRequest(): Promise<Channel[]> {
    return this.channelService.fetchAllTodos();
  }
  @Post()
  PostRequest(@Body() createChannelDto: CreateChannelDto): string {
    console.log(createChannelDto);
    return `${createChannelDto} PostRequest!`;
  }
  @Get(':id')
  ParamRequest(@Param('id') id: number): Promise<Channel> {
    return this.channelService.fetchChannelById(id);
  }
  @Put(':id')
  PutRequest(@Param('id') id: number): string {
    return `${id} PutRequest`;
  }
  @Delete(':id')
  DeleteRequest(@Param('id') id: number): string {
    return `${id} DeleteRequest`;
  }
}
