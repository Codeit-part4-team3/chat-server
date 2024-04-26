import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { ServerService } from './server.service';
import { PrismaService } from '../prisma.service';
import * as winston from 'winston';

describe('ServerService', () => {
  let service: ServerService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerService,
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
        WinstonModule.forRoot({
          transports: [new winston.transports.Console()],
        }),
      ],
    }).compile();

    service = module.get<ServerService>(ServerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should call findMany when getAllServer is called', async () => {
    await service.getAllServer();
    expect(prismaService.server.findMany).toHaveBeenCalled();
  });

  it('should call create when createServer is called', async () => {
    await service.createServer({
      name: 'test',
      imageUrl: 'test',
    });
    expect(prismaService.server.create).toHaveBeenCalled();
  });

  it('should call update when patchServer is called', async () => {
    await service.patchServer(0, {
      name: 'test',
      imageUrl: 'test',
    });
    expect(prismaService.server.update).toHaveBeenCalled();
  });
});
