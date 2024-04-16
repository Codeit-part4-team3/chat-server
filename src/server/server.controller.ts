import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto, PatchServerDto } from 'src/entities/server.dto';
import { Server } from '@prisma/client';

//
// # 서버 관련 API
//
// ## 전체 서버 리스트 조회 GET /server/all
// ## 서버 생성 POST /server
// ## 서버 수정 PUT /server/:id
// ## 서버 삭제 DELETE // kafka 필요 서버 삭제시 해당 서버의 모든 채널과 채널의 모든 메시지 삭제
// ## 서버 초대 // kafka 필요
//

@Injectable()
@Controller('api/chat/v1/server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Get('all')
  async GetAllRequest(): Promise<Server[]> {
    return this.serverService.getAllServer();
  }

  @Post()
  async PostRequest(@Body() createServerDto: CreateServerDto): Promise<Server> {
    return this.serverService.createServer(createServerDto);
  }

  @Patch(':id')
  async PatchRequest(
    @Param('id') id: number,
    @Body() patchServerDto: PatchServerDto,
  ): Promise<Server> {
    return this.serverService.patchServer(id, patchServerDto);
  }
}
