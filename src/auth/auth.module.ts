import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { ConfigModule } from 'src/config/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './consts';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d', },
    })
  ],
  providers: [
    AuthService, LocalStrategy, JwtStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }