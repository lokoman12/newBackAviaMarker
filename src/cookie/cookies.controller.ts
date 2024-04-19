
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class CookiesController {
  constructor() {}

  @Get('cookies')
  getCookies(@Req() req: Request): any {
    return req.cookies;
  }
}