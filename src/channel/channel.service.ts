import { Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private prismaService: PrismaService) {}

  async fetchAllTodos(): Promise<Channel[]> {
    return this.prismaService.channel.findMany();
  }

  async fetchChannelById(id: number): Promise<Channel> {
    return this.prismaService.channel.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteTodoById(id: number): Promise<Channel> {
    return this.prismaService.channel.delete({
      where: {
        id,
      },
    });
  }
}
