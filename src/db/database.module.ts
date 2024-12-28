import { Logger, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApiConfigService } from 'src/config/api.config.service';
import { ApiConfigModule } from 'src/config/config.module';
import { getSequelizeDbConnectionPropertiesConfig } from './sequelize.config';
import { Sequelize } from 'sequelize-typescript';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService,],
      useFactory: async (configService: ApiConfigService) => {
        return getSequelizeDbConnectionPropertiesConfig(configService.getDbUri());
      },
    }),
  ],
})
export class DatabaseModule implements NestModule {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly sequelize: Sequelize) {
    this.logger.debug('Init DatabaseModule');
  }

  async onModuleInit() {
    // this.logger.debug('Initialize');
    // try {
    //   await this.sequelize.sync({ alter: true, });
    //   this.log.debug('Database synchronized.');
    // } catch (error) {
    //   this.log.error('Error during database synchronization:', error);
    // }
  }

  configure() {
    // this.logger.debug('Configure');
  }
}