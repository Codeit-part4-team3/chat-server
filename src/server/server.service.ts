import { Body, Inject, Injectable } from '@nestjs/common';
import { Server, UserServer } from '@prisma/client';
import {
  CreateServerDto,
  InviteServerDto,
  InviteServerLinkDto,
  InviteUserServerResponseDto,
  PatchServerDto,
} from '../entities/server.dto';
import { PrismaService } from '../prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { encoding } from '../utils/secret';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

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
  ): Promise<string> {
    const inviteeId = await firstValueFrom(
      this.httpService
        .post<InviteUserServerResponseDto>(
          'http://localhost:80/internal/v1/verifyEmail',
          {
            email: inviteServerDto.inviteeEmail,
          },
        )
        .pipe(
          map((res) => {
            return res;
          }),
        ),
    );

    this.logger.info(`[service] inviteMember ${inviteeId}`);
    return inviteeId.data.userId;
    // return this.createUserLinkServer(serverId, sId);
  }
}
