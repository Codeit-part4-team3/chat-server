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
  Delete,
  Query,
  UseGuards,
  Put,
  UseInterceptors,
  ParseFilePipe,
  UploadedFile,
  FileTypeValidator,
} from '@nestjs/common';
import { ServerService } from './server.service';
import {
  AcceptInviteDto,
  CreateServerDto,
  EventDto,
  GetEventDto,
  InvitedServer,
  InviteServerDto,
  InviteServerLinkDto,
  PatchServerDto,
} from '../entities/server.dto';
import { InviteServer, Server, UserServer, Event } from '@prisma/client';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from '../auth/auth-guard';
import { FileInterceptor } from '@nestjs/platform-express';

//
// # 서버 관련 API
//
// ## 전체 서버 리스트 조회 GET /server/all
// ## 서버 생성 POST /server
// ## 서버 수정 PUT /server/:id
// ## 서버 삭제 DELETE // kafka 필요 서버 삭제시 해당 서버의 모든 채널과 채널의 모든 메시지 삭제
// ## 서버 초대 // kafka 필요
//

@UseGuards(JwtAuthGuard)
@Injectable()
@Controller('chat/v1/server')
export class ServerController {
  constructor(
    private readonly serverService: ServerService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('all')
  @HttpCode(200)
  async getAllRequest(@Query('userId') userId: number): Promise<Server[]> {
    this.logger.info('[controller] Get /chat/v1/server/all');
    return this.serverService.getAllServer(userId);
  }

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('imageFile'))
  async postRequest(
    @Body() createServerDto: CreateServerDto,
    @Query('userId') userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    imageFile: Express.Multer.File,
  ) {
    return this.serverService
      .createServer(createServerDto, imageFile)
      .then((server) => {
        this.serverService.createUserLinkServer(server.id, userId);
        return server;
      });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageFile'))
  async patchRequest(
    @Param('id') id: number,
    @Body() patchServerDto: PatchServerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    imageFile: Express.Multer.File, // Add @Optional() decorator to allow null
  ): Promise<Server | void> {
    return this.serverService.patchServer(id, patchServerDto, imageFile);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteRequest(@Param('id') id: number): Promise<void> {
    this.serverService.deleteServer(id);
  }

  @Get(':id/inviteLink')
  @HttpCode(200)
  async getInviteLink(@Param('id') id: number): Promise<InviteServerLinkDto> {
    return this.serverService.generateInviteLink(id);
  }

  // @Post(':id/inviteLink') body에 inviteLink, 로그인된 유저인지 확인 후 서버에 추가

  @Post(':id/inviteMember')
  @HttpCode(200)
  async inviteMember(
    @Param('id') id: number,
    @Body() inviteServerDto: InviteServerDto,
  ): Promise<InviteServer> {
    return this.serverService.inviteMember(id, inviteServerDto);
  }

  @Get('invitedServer')
  @HttpCode(200)
  async getInvitedServer(
    @Query('userId') id: number,
  ): Promise<InvitedServer[]> {
    return this.serverService.invitedServerList(id);
  }

  @Post('invitedServer')
  @HttpCode(200)
  async postInvitedServer(
    @Query('userId') userId: number,
    @Body() acceptInviteDto: AcceptInviteDto,
  ): Promise<UserServer | null> {
    return this.serverService.acceptInvite(userId, acceptInviteDto);
  }

  @Post('event')
  @HttpCode(201)
  async postEvent(@Body() event: EventDto): Promise<Event> {
    return await this.serverService.createEvent(event);
  }

  @Get('events/all')
  @HttpCode(200)
  async getAllEvents(@Query('serverId') serverId: number): Promise<Event[]> {
    return await this.serverService.getAllEvents(serverId);
  }

  @Get('events')
  @HttpCode(200)
  async getEvents(
    @Query('serverId') serverId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!serverId || !startDate || !endDate) {
      throw new Error('Invalid query');
    }

    const getEventDto: GetEventDto = {
      serverId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    return await this.serverService.getEvents(getEventDto);
  }

  @Put('event/update')
  @HttpCode(200)
  async updateEvent(
    @Query('eId') eId: number,
    @Body() event: EventDto,
  ): Promise<Event> {
    return await this.serverService.updateEvent(eId, event);
  }

  @Delete('event/delete')
  @HttpCode(204)
  async deleteEvent(@Query('eId') eId: number) {
    // console.log(eId);
    this.serverService.deleteEvent(eId);
  }
}
