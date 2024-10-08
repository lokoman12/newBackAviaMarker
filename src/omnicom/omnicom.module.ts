import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Scout from 'src/db/models/scout.model';
import { OmnicomController } from './omnicom.controller';
import { ApiConfigModule } from 'src/config/config.module';
import OmnicomService from './omnicom.service';


@Module({
  imports: [ApiConfigModule, SequelizeModule.forFeature([Scout])],
  providers: [OmnicomService,],
  controllers: [OmnicomController],
  exports: [SequelizeModule, OmnicomService],
})
export class OmnicomModule implements NestModule {
  private readonly logger = new Logger(OmnicomModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init OmnicomModule');
  }
}