import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import AODB from 'src/db/models/fpln.model';
import { FplnController } from './fpln.controller';
import FplnService from './fpln.service';


@Module({
  imports: [SequelizeModule.forFeature([AODB])],
  providers: [FplnService,],
  controllers: [FplnController],
  exports: [FplnService, SequelizeModule,],
})

export class FplnModule implements NestModule {
  private readonly logger = new Logger(FplnModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init FplnModule');
  }
}