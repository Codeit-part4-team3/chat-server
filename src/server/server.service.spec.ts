import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { ServerService } from './server.service';
import { PrismaService } from '../prisma.service';
import { HttpModule } from '@nestjs/axios';
import * as winston from 'winston';
import { ChannelService } from '../channel/channel.service';

describe('ServerService', () => {
  let service: ServerService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerService,
        ChannelService,
        {
          provide: PrismaService,
          useValue: {
            server: {
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
      imports: [
        HttpModule,
        WinstonModule.forRoot({
          transports: [new winston.transports.Console()],
        }),
      ],
    }).compile();

    service = module.get<ServerService>(ServerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should call update when patchServer is called', async () => {
    await service.patchServer(0, {
      name: 'test',
      imageUrl: 'test',
    });
    expect(prismaService.server.update).toHaveBeenCalled();
  });
});
