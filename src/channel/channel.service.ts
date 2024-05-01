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

  async getAllChannel(uId: number, sId: number): Promise<Channel[]> {
    this.logger.info('[service] getAllChannel');
    const userChannels = await this.prismaService.userChannel.findMany({
      where: {
        userId: uId,
      },
    });

    const channelIds = userChannels.map((userChannel) => userChannel.channelId);
    const channels = await this.prismaService.channel.findMany({
      where: {
        id: {
          in: channelIds,
        },
        serverId: sId,
      },
    });
    return channels;
  }

  async createChannel(
    serverId: number,
    channel: CreateChannelDto,
  ): Promise<Channel> {
    this.logger.info('[service] createChannel');
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
    this.logger.info('[service] patchChannel');
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

  async createUserLinkChannel(cId: number, uId: number): Promise<UserChannel> {
    return this.prismaService.userChannel.create({
      data: {
        channelId: cId,
        userId: uId,
      },
    });
  }
}
