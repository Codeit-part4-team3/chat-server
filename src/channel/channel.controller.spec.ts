import { Test, TestingModule } from '@nestjs/testing';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { PrismaService } from '../prisma.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AuthService } from '../auth/auth.service';

describe('ChannelController', () => {
  let controller: ChannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelController],
      providers: [ChannelService, PrismaService, AuthService],
      imports: [
        WinstonModule.forRoot({
          transports: [new winston.transports.Console()],
        }),
      ],
    }).compile();

    controller = module.get<ChannelController>(ChannelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
