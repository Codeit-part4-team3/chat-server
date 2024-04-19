import { Injectable } from '@nestjs/common';
import { Channel, UserChannel } from '@prisma/client';
import { CreateChannelDto, PactchChannelDto } from '../entities/channel.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChannelService {
  constructor(private prismaService: PrismaService) {}

  async getAllChannel(): Promise<Channel[]> {
    return this.prismaService.channel.findMany();
  }

  async createChannel(channel: CreateChannelDto): Promise<Channel> {
    return this.prismaService.channel.create({
      data: {
        name: channel.name,
        isPrivate: channel.isPrivate,
        isVoice: channel.isVoice,
        serverId: channel.serverId,
      },
    });
  }

  async patchChannel(cId: number, channel: PactchChannelDto): Promise<Channel> {
    return this.prismaService.channel.update({
      where: {
        id: cId,
      },
      data: {
        name: channel.name,
        isPrivate: channel.isPrivate,
        isVoice: channel.isVoice,
      },
    });
  }

  async deleteChannel(cId: number): Promise<Channel> {
    return this.prismaService.channel.delete({
      where: {
        id: cId,
      },
    });
  }

  async getAllUserIncludeChannel(cId: number): Promise<UserChannel[]> {
    return this.prismaService.userChannel.findMany({
      where: {
        channelId: cId,
      },
    });
  }
}
