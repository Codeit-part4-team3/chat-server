import { Controller, Get } from '@nestjs/common';

@Controller({ host: 'api.localhost' })
export class SubController {
  @Get()
  getHello(): string {
    return 'Hello Sub!';
  }
}
