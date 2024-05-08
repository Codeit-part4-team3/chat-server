import { Inject, Injectable } from '@nestjs/common';
import { InviteServer, Server, UserServer, Event } from '@prisma/client';
import {
  CreateServerDto,
  EventDto,
  InviteServerDto,
  InviteServerLinkDto,
  InviteUserServerResponseDto,
  PatchServerDto,
  User,
} from '../entities/server.dto';
import { PrismaService } from '../prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { encoding } from '../utils/secret';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { InvitedServer, AcceptInviteDto } from '../entities/server.dto';

@Injectable()
export class ServerService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

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

  async createServer(server: CreateServerDto): Promise<Server> {
    return this.prismaService.server.create({
      data: {
        name: server.name,
        imageUrl: server.imageUrl,
      },
    });
  }

  async patchServer(sId: number, server: PatchServerDto): Promise<Server> {
    return this.prismaService.server.update({
      where: {
        id: sId,
      },
      data: {
        name: server.name,
        imageUrl: server.imageUrl,
      },
    });
  }

  async deleteServer(sId: number): Promise<Server> {
    return this.prismaService.server.delete({
      where: {
        id: sId,
      },
    });
  }

  async createUserLinkServer(sId: number, uId: number): Promise<UserServer> {
    return this.prismaService.userServer.create({
      data: {
        serverId: sId,
        userId: uId,
      },
    });
  }

  async generateInviteLink(sId: number): Promise<InviteServerLinkDto> {
    let encodeId = encoding(String(sId));
    encodeId = encodeURIComponent(`${encodeId}`);
    return { inviteLink: encodeId };
  }

  async inviteMember(
    sId: number,
    inviteServerDto: InviteServerDto,
  ): Promise<InviteServer> {
    const invitee = await firstValueFrom(
      this.httpService
        .post<InviteUserServerResponseDto>(
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
          >(`${process.env.USER_SERVER_URL}/internal/v1/userNames`, { ids: inviterIds })
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
}
