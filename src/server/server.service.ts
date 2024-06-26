import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InviteServer, Server, UserServer, Event } from '@prisma/client';
import {
  CreateServerDto,
  EventDto,
  GetEventDto,
  InviteServerDto,
  GenerateServerLinkDto,
  InternalVerifyEmailDto,
  PatchServerDto,
  User,
  InviteLinkDto,
} from '../entities/server.dto';
import { PrismaService } from '../prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { decoding, encoding } from '../utils/secret';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { InvitedServer, AcceptInviteDto } from '../entities/server.dto';
import { ChannelService } from '../channel/channel.service';
import * as S3Client from 'aws-sdk/clients/s3';

@Injectable()
export class ServerService {
  private readonly s3Client: S3Client;
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    private channelService: ChannelService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.s3Client = new S3Client({
      region: 'ap-northeast-2',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async upload(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('파일이 필요합니다.', HttpStatus.NOT_FOUND);
    }

    const { originalname, buffer } = file;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `images/${Date.now()}-${originalname}`,
      Body: buffer,
    };

    try {
      const res = await this.s3Client.upload(params).promise();

      return res.Location;
    } catch (e) {
      throw new HttpException('서버에러', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllServer(uId: number): Promise<Server[]> {
    const userServers = await this.prismaService.userServer.findMany({
      where: {
        userId: uId,
      },
    });

    const serverIds = userServers.map((userServer) => userServer.serverId);
    const servers = await this.prismaService.server.findMany({
      where: {
        id: {
          in: serverIds,
        },
      },
    });

    return servers;
  }

  async createServer(
    server: CreateServerDto,
    imageFile?: Express.Multer.File,
  ): Promise<Server> {
    let result;

    if (imageFile) {
      const imageUrl = await this.upload(imageFile);

      result = await this.prismaService.server.create({
        data: {
          name: server.name,
          imageUrl,
        },
      });
    } else {
      result = await this.prismaService.server.create({
        data: {
          name: server.name,
          imageUrl: '',
        },
      });
    }

    // Todo : 상위 Controller로 이동
    if (!result)
      throw new HttpException(
        '서버 생성 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    Promise.all([
      this.channelService
        .createChannel(result.id, {
          name: '일반 카테고리',
          isPrivate: false,
          isVoice: false,
        })
        .then((group) =>
          this.channelService.createChannel(result.id, {
            name: '일반',
            isPrivate: false,
            isVoice: false,
            groupId: group.id,
          }),
        ),
      this.channelService
        .createChannel(result.id, {
          name: '음성 카테고리',
          isPrivate: false,
          isVoice: false,
        })
        .then((group) =>
          this.channelService.createChannel(result.id, {
            name: '음성',
            isPrivate: false,
            isVoice: true,
            groupId: group.id,
          }),
        ),
    ]);

    return result;
  }

  async patchServer(
    sId: number,
    server: PatchServerDto,
    imageFile?: Express.Multer.File,
  ): Promise<Server> {
    if (imageFile) {
      const imageUrl: string = await this.upload(imageFile);

      return await this.prismaService.server.update({
        where: {
          id: sId,
        },
        data: {
          name: server.name,
          imageUrl,
        },
      });
    } else {
      return await this.prismaService.server.update({
        where: {
          id: sId,
        },
        data: {
          name: server.name,
          imageUrl: server.imageUrl,
        },
      });
    }
  }

  async deleteServer(sId: number): Promise<Server> {
    await Promise.all([
      this.channelService.deleteChannelByServerId(sId),
      this.prismaService.userServer.deleteMany({
        where: {
          serverId: sId,
        },
      }),
      this.prismaService.event.deleteMany({
        where: {
          serverId: sId,
        },
      }),
    ]);

    return await this.prismaService.server.delete({
      where: {
        id: sId,
      },
    });
  }

  async getUsers(sId: number): Promise<User[]> {
    this.logger.info('[getUsers]');
    const userServers = await this.prismaService.userServer.findMany({
      where: {
        serverId: sId,
      },
    });

    this.logger.info(JSON.stringify(userServers));
    const userIds = userServers.map((userServer) => userServer.userId);
    this.logger.info(JSON.stringify(userIds));

    return await firstValueFrom(
      this.httpService
        .post<User[]>(`${process.env.USER_SERVER_URL}/internal/v1/users`, {
          ids: userIds,
        })
        .pipe(
          map((res) => {
            return res.data;
          }),
        ),
    );
  }

  async createUserLinkServer(sId: number, uId: number): Promise<UserServer> {
    return this.prismaService.userServer.create({
      data: {
        serverId: sId,
        userId: uId,
      },
    });
  }

  async generateInviteLink(sId: number): Promise<GenerateServerLinkDto> {
    let encodeId = encoding(String(sId));
    encodeId = encodeURIComponent(`${encodeId}`);
    return { inviteLink: encodeId };
  }

  async redirectInviteLink(inviteLinkDto: InviteLinkDto): Promise<object> {
    const decodeId = decodeURIComponent(inviteLinkDto.secretKey);
    const sId = Number(decoding(decodeId));

    const result = await this.createUserLinkServer(
      sId,
      inviteLinkDto.inviteeId,
    );

    return { redirectUrl: `server/${result.serverId}` };
  }

  async inviteMember(
    sId: number,
    inviteServerDto: InviteServerDto,
  ): Promise<InviteServer> {
    const invitee = await firstValueFrom(
      this.httpService
        .post<InternalVerifyEmailDto>(
          `${process.env.USER_SERVER_URL}/internal/v1/verifyEmail`,
          {
            email: inviteServerDto.inviteeEmail,
          },
        )
        .pipe(
          map((res) => {
            return res.data;
          }),
        ),
    );

    return this.prismaService.inviteServer.create({
      data: {
        inviterId: inviteServerDto.inviterId,
        inviteeId: invitee.id,
        serverId: sId,
      },
    });
  }

  async invitedServerList(uId: number): Promise<InvitedServer[]> {
    const invitedServers = await this.prismaService.inviteServer.findMany({
      where: {
        inviteeId: uId,
      },
    });

    const inviterIds = invitedServers.map((invitedServer) => {
      return invitedServer.inviterId;
    });

    const inviteList = await Promise.all([
      await Promise.all(
        invitedServers.map((invitedServer) => {
          return this.prismaService.server.findUnique({
            where: {
              id: invitedServer.serverId,
            },
            select: {
              name: true,
            },
          });
        }),
      ),
      await firstValueFrom(
        this.httpService
          .post<
            User[]
          >(`${process.env.USER_SERVER_URL}/internal/v1/users`, { ids: inviterIds })
          .pipe(
            map((res) => {
              return res.data;
            }),
          ),
      ),
    ]);
    const [serverNames, inviters] = await inviteList;

    const result = Promise.all(
      serverNames.map((serverName, i) => ({
        inviteId: invitedServers[i].id,
        serverName: serverName.name,
        inviterName: inviters[i].nickname,
      })),
    );

    return result;
  }

  async acceptInvite(
    uId: number,
    acceptInviteDto: AcceptInviteDto,
  ): Promise<UserServer | null> {
    const invite = await this.prismaService.inviteServer.findUnique({
      where: {
        id: acceptInviteDto.inviteId,
      },
    });

    let result = null;
    if (acceptInviteDto.isAccept) {
      result = await this.createUserLinkServer(invite.serverId, uId);
    }
    await this.prismaService.inviteServer.delete({
      where: {
        id: acceptInviteDto.inviteId,
      },
    });

    return result;
  }

  async createEvent(event: EventDto): Promise<Event> {
    return await this.prismaService.event.create({
      data: {
        title: event.title,
        start: event.start,
        serverId: event.serverId,
      },
    });
  }

  async getAllEvents(sId: number): Promise<Event[]> {
    return await this.prismaService.event.findMany({
      where: {
        serverId: sId,
      },
    });
  }

  async getEvents(getEventDto: GetEventDto): Promise<Event[]> {
    const res = await this.prismaService.event.findMany({
      where: {
        serverId: getEventDto.serverId,
        start: { gte: getEventDto.startDate, lte: getEventDto.endDate },
      },
    });
    console.log(res);
    return res;
  }

  async updateEvent(eId: number, event: EventDto): Promise<Event> {
    return await this.prismaService.event.update({
      where: {
        id: eId,
      },
      data: {
        title: event.title,
        start: event.start,
        serverId: event.serverId,
      },
    });
  }

  async deleteEvent(eId: number) {
    await this.prismaService.event.delete({
      where: {
        id: eId,
      },
    });
  }
}
