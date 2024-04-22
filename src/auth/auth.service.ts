import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import User, { IUser } from 'src/db/models/user';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiConfigService } from 'src/config/api.config.service';
import { config } from 'dotenv';
import { AuthDto, CreateUserDto } from 'src/user/user.dto';
import { JwtTokenType } from './types';

@Injectable()
export class AuthService {
  private readonly log = new Logger(AuthService.name);

  constructor(
    private configService: ApiConfigService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
    this.log.log('Init AuthService, access: ' + this.configService.getJwtAccessSecret() + ", refresh" + this.configService.getJwtRefreshSecret());
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    await this.usersService.updateUser(userId, {
      refreshToken,
    })
  }

  private async getTokens(userId: number, username: string): Promise<JwtTokenType> {
    const [accessToken, refreshToken] = await Promise.all(
      [
        this.jwtService.signAsync(
          {
            sub: userId,
            username,
          },
          {
            secret: this.configService.getJwtAccessSecret(),
            expiresIn: this.configService.getJwtAccessExpiresIn(),
          },
        ),
        this.jwtService.signAsync(
          {
            sub: userId,
            username,
          },
          {
            secret: this.configService.getJwtRefreshSecret(),
            expiresIn: this.configService.getJwtRefreshExpiresIn(),
          },
        ),
      ]
    );

    return {
      accessToken,
      refreshToken,
    };
  };

  async signUp(dto: CreateUserDto): Promise<any> {
    const isUserExists = await this.usersService.findUserByLogin(dto.username);
    if (isUserExists) {
      throw new BadRequestException(`User ${dto.username} already exists`);
    }

    const newUser = await this.usersService.createUser(dto);
    const tokens = await this.getTokens(newUser.id, newUser.username);

    //  await updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto) {
    const user = await this.usersService.findUserByLogin(data.username);
    if (!user) {
      throw new BadRequestException(`User ${data.username} does not exist!`);
    }

    if (data.password !== user.password) {
      throw new BadRequestException(`Password for user ${data.username} is incorrect!`);
    }

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
    };
  }

  async logout(userId: number) {
    this.usersService.updateUser(userId, { refreshToken: null, });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findUserById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    if (!refreshToken) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}