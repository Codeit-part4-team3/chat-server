import { Test, TestingModule } from '@nestjs/testing';
import { ServerController } from './server.controller';
import { PrismaService } from '../prisma.service';
import { ServerService } from './server.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from '../auth/auth.service';
import { ChannelService } from '../channel/channel.service';

describe('ServerController', () => {
  let controller: ServerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerController],
      providers: [ServerService, PrismaService, AuthService, ChannelService], // why PrismaService?
      imports: [
        HttpModule,
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
