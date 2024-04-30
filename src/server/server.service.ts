import { Inject, Injectable } from '@nestjs/common';
import { Server } from '@prisma/client';
import { CreateServerDto, PatchServerDto } from '../entities/server.dto';
import { PrismaService } from '../prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class ServerService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAllServer(): Promise<Server[]> {
    this.logger.info('[service] getAllServer');
    return this.prismaService.server.findMany();
  }

  async createServer(server: CreateServerDto): Promise<Server> {
    this.logger.info('[service] createServer');
    return this.prismaService.server.create({
      data: {
        name: server.name,
        imageUrl: server.imageUrl,
      },
    });
  }

  async patchServer(sId: number, server: PatchServerDto): Promise<Server> {
    this.logger.info('[server] patchServer');
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
    this.logger.info('[server] deleteServer');
    return this.prismaService.server.delete({
      where: {
        id: sId,
      },
    });
  }
}
