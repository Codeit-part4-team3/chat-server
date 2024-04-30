import { Inject, Injectable } from '@nestjs/common';
import { Channel, UserChannel } from '@prisma/client';
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

  async getAllChannel(): Promise<Channel[]> {
    this.logger.info('[service] getAllChannel');
    return this.prismaService.channel.findMany();
  }

  async createChannel(channel: CreateChannelDto): Promise<Channel> {
    this.logger.info('[service] createChannel');
    return this.prismaService.channel.create({
      data: {
        name: channel.name,
        isPrivate: channel.isPrivate,
        isVoice: channel.isVoice,
        serverId: channel.serverId,
        groupId: channel.groupId,
      },
    });
  }

  async patchChannel(cId: number, channel: PatchChannelDto): Promise<Channel> {
    this.logger.info('[service] patchChannel');
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
    this.logger.info('[service] deleteChannel');
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
