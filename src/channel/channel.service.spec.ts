import { Test, TestingModule } from '@nestjs/testing';
import { ChannelService } from './channel.service';
import { PrismaService } from '../prisma.service';

describe('ChannelService', () => {
  let service: ChannelService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        {
          provide: PrismaService,
          useValue: {
            channel: {
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            userChannel: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ChannelService>(ChannelService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should call findMany when getAllChannel is called', async () => {
    await service.getAllChannel();
    expect(prismaService.channel.findMany).toHaveBeenCalled();
  });

  it('should call create when createChannel is called', async () => {
    await service.createChannel({
      name: 'test',
      isPrivate: false,
      isVoice: false,
      serverId: 0,
    });
    expect(prismaService.channel.create).toHaveBeenCalled();
  });

  it('should call update when patchChannel is called', async () => {
    await service.patchChannel(0, {
      name: 'test',
      isPrivate: false,
      isVoice: false,
    });
    expect(prismaService.channel.update).toHaveBeenCalled();
  });

  it('should call delete when deleteChannel is called', async () => {
    await service.deleteChannel(0);
    expect(prismaService.channel.delete).toHaveBeenCalled();
  });

  it('should call update when getAllUserIncludeChannel is called', async () => {
    await service.getAllUserIncludeChannel(0);
    expect(prismaService.userChannel.findMany).toHaveBeenCalled();
  });
});
