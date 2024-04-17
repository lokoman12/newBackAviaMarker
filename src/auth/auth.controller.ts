import {
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/auth.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly log = new Logger(AuthController.name);

  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const { access_token } = await this.authService.login(req.user);
    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .send({ status: 'ok' });
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
