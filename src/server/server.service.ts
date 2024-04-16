import { Injectable } from '@nestjs/common';
import { Server } from '@prisma/client';
import { CreateServerDto, PatchServerDto } from 'src/entities/server.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ServerService {
  constructor(private prismaService: PrismaService) {}

  async getAllServer(): Promise<Server[]> {
    return this.prismaService.server.findMany();
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
}
