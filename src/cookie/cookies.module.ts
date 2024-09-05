import { Inject, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import cookiesConfig from './cookies.config';
import { CookiesController } from './cookies.controller';

@Module({
  imports: [ConfigModule.forFeature(cookiesConfig)],
  controllers: [CookiesController]
})
export class CookiesModule implements NestModule {
  private readonly logger = new Logger(ConfigModule.name);

  constructor(
    @Inject(cookiesConfig.KEY)
    private readonly config: ConfigType<typeof cookiesConfig>,
  ) {
    this.logger.debug('CookiesModule, config' + JSON.stringify(config));
  }

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug("CookiesModule configure");
  }
}