import { Test, TestingModule } from '@nestjs/testing';
import { CommonController } from './common.controller';
import { ChannelService } from '../channel/channel.service';
import { AuthService } from '../auth/auth.service';
import { ServerService } from '../server/server.service';
import { PrismaService } from '../prisma.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { HttpModule } from '@nestjs/axios';

describe('CommonController', () => {
  let controller: CommonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonController],
      providers: [ServerService, AuthService, ChannelService, PrismaService], // why PrismaService?
      imports: [
        HttpModule,
        WinstonModule.forRoot({
          transports: [new winston.transports.Console()],
        }),
      ],
    }).compile();

    controller = module.get<CommonController>(CommonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
