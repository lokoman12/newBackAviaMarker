import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ApiConfigService } from 'src/config/api.config.service';
import { UsersService } from 'src/user/user.service';
import { JwtPayload } from '../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(AccessTokenStrategy.name);

  constructor(
    private configService: ApiConfigService,
    private userService: UsersService
  ) {
    console.log('Load access strategy: ' + configService.getJwtAccessSecret());
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJwtAccessSecret(),
    });
  }

  async validate(payload: JwtPayload) {
    // this.log.log('Access strategy, validate', JSON.stringify(payload));
    return payload;
  }
}