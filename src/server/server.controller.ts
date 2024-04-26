import {
  Inject,
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
  HttpCode,
  Options,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto, PatchServerDto } from '../entities/server.dto';
import { Server } from '@prisma/client';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

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
@Controller('chat/v1/server')
export class ServerController {
  constructor(
    private readonly serverService: ServerService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('all')
  @HttpCode(200)
  async GetAllRequest(): Promise<Server[]> {
    this.logger.info('[controller] Get /chat/v1/server/all');
    return this.serverService.getAllServer();
  }

  @Post()
  @HttpCode(201)
  async PostRequest(@Body() createServerDto: CreateServerDto): Promise<Server> {
    this.logger.info('[controller] Post /chat/v1/server');
    return this.serverService.createServer(createServerDto);
  }

  @Patch(':id')
  @HttpCode(200)
  async PatchRequest(
    @Param('id') id: number,
    @Body() patchServerDto: PatchServerDto,
  ): Promise<Server> {
    this.logger.info('[controller] Patch /chat/v1/server/:id');
    return this.serverService.patchServer(id, patchServerDto);
  }

  @Options()
  @HttpCode(204)
  async OptionsRequest(): Promise<void> {
    this.logger.info('[controller] Options /chat/v1/server');
  }
}
