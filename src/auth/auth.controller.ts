import {
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
  Body,
  HttpStatus,
  HttpCode,
  Res,
  Query,
  BadRequestException
} from '@nestjs/common';
import { AccessTokenGuard } from './guards/access.token.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../user/user.service';
import { Public } from 'src/auth/decorators/public.decorator';

import { Request, Response } from 'express';
import { AuthDto, CreateUserDto } from 'src/user/user.dto';
import { RefreshTokenGuard } from './guards/refresh.token.guard';
import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { LoginTypeResponse } from './types';
import User from 'src/db/models/user';
import { RecordStatusService } from 'src/user-history/record.status.service';

@Controller('/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly recordStatusService: RecordStatusService
  ) { }

  @Post('signup')
  signin(@Body() data: CreateUserDto) {
    return this.authService.signUp(data);
  }

  @Public()
  @Post('login-get')
  @HttpCode(HttpStatus.OK)
  async loginGet(
    @Query('username') username: string,
    @Query('password') password: string
    , @Res({ passthrough: true }) response: Response
  ) {
    this.logger.warn('Login, user: ' + username);
    const { accessToken } = await this.authService.signIn({ username, password });
    // При логине сбрасываем статус воспроизведения истории, если был включен
    await this.recordStatusService.resetRecordStatus(username);

    return { accessToken };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: AuthDto
    , @Req() req: Request
    , @Res({ passthrough: true }) response: Response<LoginTypeResponse>
  ) {
    // this.log.log('LoginController, cookies: ' + req.cookies.test);
    const { username } = data;
    this.logger.warn('Login, user: ' + username);
    const signInData = await this.authService.signIn(data);
    // При логине сбрасываем статус воспроизведения истории, если был включен
    await this.recordStatusService.resetRecordStatus(username);
    return {
      ...signInData,
      username,
      permissions: {
        isUser: true,
        isDispatcher: true,
        isAdmin: true,
      }
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    const { username } = req.user as User;
    var user = this.userService.findUserByLogin(username);
    if (!user) {
      throw new BadRequestException(`Can not find user by login ${username}`);
    }
    return req.user;
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logoff(@Req() req) {
    this.authService.logout(req.user['sub']);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string
  ) {
    this.logger.log('Refreshm, userId: ' + userId);
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
