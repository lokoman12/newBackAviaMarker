import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApiConfigService } from 'src/config/api.config.service';
import { ApiConfigModule } from 'src/config/config.module';
import getSequelizeConfig from './sequelize.config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService,],
      useFactory: async (configService: ApiConfigService) => {
        return getSequelizeConfig(configService.getDbUri());
      },
    }),
  ],
})
export class DatabaseModule implements NestModule {
  private readonly log = new Logger(DatabaseModule.name);

  constructor() {
    this.log.debug('Init DatabaseModule');
  }

  configure() {
    this.log.debug('DatabaseModule configure');
  }
}