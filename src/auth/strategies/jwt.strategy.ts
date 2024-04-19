import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { ApiConfigService } from 'src/config/api.config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly log = new Logger(JwtStrategy.name);

  constructor(private configService: ApiConfigService) {
    console.log('Load jwt strategy');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret(),
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    console.log('Jwt strategy, extractJWTFromCookie: cookies', JSON.stringify(req.cookies));

    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    console.log('Jwt strategy, extractJWTFromCookie access_token: empty');
    return null;
  }

  async validate(payload: any) {
    this.log.log('Jwt strategy, validate', JSON.stringify(payload));
    return { userId: payload.sub, username: payload.username };
  }
}