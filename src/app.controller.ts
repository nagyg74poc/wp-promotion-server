import { Get, Controller, Res, Req } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {
  // }
  //
  // @Get('/')
  // root(@Res() res): void {
  //   res.sendFile('index.html', { root: path.join(__dirname, '..', '/public') });
  // }
  //
  // @Get('/*')
  // rootAssets(@Req() req, @Res() res): void {
  //   res.sendFile('index.html', { root: path.join(__dirname, '..', '/public') });
  // }
}
