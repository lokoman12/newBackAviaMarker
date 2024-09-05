import { Logger, Module, NestModule } from '@nestjs/common';
import { ApiConfigService } from './api.config.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../environment/env.validation';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env',],
      validate,
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule implements NestModule {
  private readonly logger = new Logger(ApiConfigModule.name);

  constructor(
  ) {
    this.logger.debug('Init ApiConfigModule');
  }

  configure() {
    this.logger.debug('ConfigModule configure');
  }
}