import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { ApiConfigModule } from 'src/config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access.token.strategy';
import { ApiConfigService } from 'src/config/api.config.service';
import { RefreshTokenStrategy } from './strategies/refresh.token.strategy';
import { HistoryModule } from 'src/history/history.module';
import { UserHistoryModule } from 'src/user-history/user.history.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    ApiConfigModule,
    PassportModule,
    PrismaModule,
    UsersModule,
    UserHistoryModule,
    HistoryModule,
    JwtModule.registerAsync({
      imports: [ApiConfigModule,],
      useFactory: async (configService: ApiConfigService) => {
        return {
          global: true,
          secret: configService.getJwtAccessSecret(),
          signOptions: { expiresIn: configService.getJwtAccessExpiresIn(), },
        };
      },
      inject: [ApiConfigService,],
    }),
  ],
  providers: [
    AuthService, AccessTokenStrategy, RefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {
  private readonly logger = new Logger(AuthModule.name);

  constructor() {
    this.logger.debug('Init AuthModule');
  }
}