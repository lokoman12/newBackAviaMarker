import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Podhod from 'src/db/models/podhod.model';
import { PodhodController } from './podhod.controller';
import PodhodService from './podhod.service';


@Module({
  imports: [SequelizeModule.forFeature([Podhod]),],
  providers: [PodhodService,],
  controllers: [PodhodController,],
  exports: [PodhodService, SequelizeModule,],
})
export class PodhodModule implements NestModule {
  private readonly logger = new Logger(PodhodModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init PodhodModule');
  }
}