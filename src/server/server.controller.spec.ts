import { Test, TestingModule } from '@nestjs/testing';
import { ServerController } from './server.controller';
import { PrismaService } from '../prisma.service';
import { ServerService } from './server.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

describe('ServerController', () => {
  let controller: ServerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerController],
      providers: [ServerService, PrismaService], // why PrismaService?
      imports: [
        WinstonModule.forRoot({
          transports: [new winston.transports.Console()],
        }),
      ],
    }).compile();

    controller = module.get<ServerController>(ServerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
