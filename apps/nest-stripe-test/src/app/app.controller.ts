import { Controller, Get, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('App')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('config')
  getData() {
    return this.appService.getConfig();
  }

  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
}
