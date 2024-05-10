import { Inject, Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { CreateChannelDto, PatchChannelDto } from '../entities/channel.dto';
import { PrismaService } from '../prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class ChannelService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAllChannel(sId: number): Promise<Channel[]> {
    const channels = await this.prismaService.channel.findMany({
      where: {
        serverId: sId,
      },
    });
    return channels;
  }

  async getChannel(cId: number): Promise<Channel> {
    return this.prismaService.channel.findUnique({
      where: {
        id: cId,
      },
    });
  }

  async createChannel(
    serverId: number,
    channel: CreateChannelDto,
  ): Promise<Channel> {
    return this.prismaService.channel.create({
      data: {
        name: channel.name,
        isPrivate: channel.isPrivate,
        isVoice: channel.isVoice,
        groupId: channel.groupId,
        serverId: serverId,
      },
    });
  }

  async patchChannel(cId: number, channel: PatchChannelDto): Promise<Channel> {
    return this.prismaService.channel.update({
      where: {
        id: cId,
      },
      data: {
        name: channel.name,
        isPrivate: channel.isPrivate,
        isVoice: channel.isVoice,
        groupId: channel.groupId,
      },
    });
  }

  async deleteChannel(cId: number): Promise<Channel | void> {
    const groupChannels = await this.prismaService.channel.findMany({
      where: {
        groupId: cId,
      },
    });

    for (const channel of groupChannels) {
      await this.prismaService.channel.delete({
        where: {
          id: channel.id,
        },
      });
    }

    const deletedChannel = await this.prismaService.channel.delete({
      where: {
        id: cId,
      },
    });

    return deletedChannel;
  }

  async deleteChannelByServerId(sId: number): Promise<void> {
    await this.prismaService.channel.deleteMany({
      where: {
        serverId: sId,
      },
    });
  }
}
