import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AznbController } from './aznb.controller';
import { ApiConfigModule } from 'src/config/config.module';
import AznbService from './aznb.service';
import Aznb from 'src/db/models/aznb.model';


@Module({
  imports: [ApiConfigModule, SequelizeModule.forFeature([Aznb])],
  providers: [AznbService,],
  controllers: [AznbController],
  exports: [SequelizeModule, AznbService],
})
export class AznbModule implements NestModule {
  private readonly logger = new Logger(AznbModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init AznbModule');
  }
}