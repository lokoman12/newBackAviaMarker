import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly log = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    console.log('Load local strategy');
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    console.log('Local strategy, validate', JSON.stringify(user));
    
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}