import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ApiConfigService } from 'src/config/api.config.service';
import { UsersService } from 'src/user/user.service';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../types';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly logger = new Logger(RefreshTokenStrategy.name);

  constructor(
    private configService: ApiConfigService,
    private userService: UsersService
  ) {
    console.log('Load refresh strategy: ' + configService.getJwtRefreshSecret());
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJwtRefreshSecret(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    this.logger.log('Refresh strategy, validate', JSON.stringify(payload));
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken, };
  }
}