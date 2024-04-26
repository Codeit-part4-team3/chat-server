import { Module, Global } from '@nestjs/common';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import * as winstonDaily from 'winston-daily-rotate-file';
import { dailyOptions } from './logger.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            nestWinstonModuleUtilities.format.nestLike('chat-server', {
              prettyPrint: true,
            }),
          ),
        }),

        new winstonDaily(dailyOptions('info')),
        new winstonDaily(dailyOptions('error')),
        new winstonDaily(dailyOptions('fatal')),
      ],
    }),
  ],
})
export class LoggerModule {}
