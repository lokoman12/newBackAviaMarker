import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from 'src/config/api.config.service';
import { AuthDto, CreateUserDto } from 'src/user/user.dto';
import { JwtTokenType, SignInDataType } from './types';
import { AUTH_LABEL } from 'src/main';
import { hasDirectorRole, hasDispatcherRole, hasEngineerRole } from './utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private configService: ApiConfigService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
    const message = `Init AuthService, access: ${this.configService.getJwtAccessSecret()}, refresh: ${this.configService.getJwtRefreshSecret()}`;
    this.logger.log({ message, });
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
      const message = `User ${dto.username} already exists`;
      this.logger.warn({ message, label: AUTH_LABEL, });
      throw new BadRequestException(`User ${dto.username} already exists`);
    }

    const newUser = await this.usersService.createUser(dto);
    const tokens = await this.getTokens(newUser.id, newUser.username);

    //  await updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto): Promise<SignInDataType> {
    const user = await this.usersService.findUserByLogin(data.username);
    if (!user) {
      const message = `User ${data.username} does not exist!`;
      this.logger.warn({ message, label: AUTH_LABEL, });
      throw new BadRequestException(message);
    }

    if (data.password !== user.password) {
      const message = `Password for user ${data.username} is incorrect!`;
      this.logger.warn({ message, label: AUTH_LABEL, });
      throw new BadRequestException(message);
    }

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      userId: user.id,
      accessToken: tokens.accessToken,
      permissions: {
        isEngineer: hasEngineerRole(user.groups),
        isDispatcher: hasDispatcherRole(user.groups),
        isDirector: hasDirectorRole(user.groups),
      }
    };
  }

  async logout(userId: number) {
    this.usersService.updateUser(userId, { refreshToken: null, });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findUserById(userId);
    if (!user || !user.refreshToken) {
      const message = `Access Denied, userId: ${userId}!`;
      this.logger.warn({ message, label: AUTH_LABEL, });
      throw new ForbiddenException(message);
    }
    if (!refreshToken) {
      const message = `Access Denied, userId: ${userId}!`;
      this.logger.warn({ message, label: AUTH_LABEL, });
      throw new ForbiddenException(message);
    }
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}