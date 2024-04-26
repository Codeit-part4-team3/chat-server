import { Controller, Get, Options, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('chat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Options('*')
  options(@Res() response: Response): void {
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,OPTIONS',
    );
    response.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    response.json();
  }
}
