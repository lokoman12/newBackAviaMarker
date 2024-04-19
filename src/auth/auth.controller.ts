import {
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/auth.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../user/user.service';
import { LoginTypeResponse } from './types';
import { Request, Response } from 'express';
import User from '../db/models/user';

@Controller('auth')
export class AuthController {
  private readonly log = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token } = await this.authService.login(req.user);

    const user = ((req.user as any)?.dataValues) as User;
    // if (!user) {
    //   this.log.warn('Не могу найти пользователя');
    //   res.clearCookie('access_token')
    //   throw new UnauthorizedException();
    // }

    res
      .cookie('jwt', access_token, {
        httpOnly: true,
        secure: false,
      });

    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        path: '/',
        domain: 'http://192.168.6.124'
        // sameSite: 'lax',
        // expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      });
    res.setHeader('Set-Cookie', 'myCookie=exampleValue');

    this.log.log('AuthController, login: ' + JSON.stringify(req.cookies));

    return {
      userId: user.id,
      permissions: {
        isUser: true,
        isAdmin: false,
        isDispatcher: true,
      }
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logoff(
    @Req() req,
    @Res({ passthrough: true }) res: Response
  ) {
    res
      .clearCookie('access_token')
      .send({ status: 'ok' });
  }
}
