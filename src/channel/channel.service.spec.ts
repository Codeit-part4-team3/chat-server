import { Test, TestingModule } from '@nestjs/testing';
import { ChannelService } from './channel.service';
import { PrismaService } from '../prisma.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

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
      imports: [
        WinstonModule.forRoot({
          transports: [new winston.transports.Console()],
        }),
      ],
    }).compile();

    service = module.get<ChannelService>(ChannelService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should call create when createChannel is called', async () => {
    await service.createChannel(0, {
      name: 'test',
      isPrivate: false,
      isVoice: false,
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
});
