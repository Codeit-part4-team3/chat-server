import { Test, TestingModule } from '@nestjs/testing';
import { ServerController } from './server.controller';
import { PrismaService } from '../prisma.service';
import { ServerService } from './server.service';

describe('ServerController', () => {
  let controller: ServerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerController],
      providers: [ServerService, PrismaService], // why PrismaService?
    }).compile();

    controller = module.get<ServerController>(ServerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
