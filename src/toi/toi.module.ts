import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ToiController } from './toi.controller';
import Toi from 'src/db/models/toi.model';
import Formular from 'src/db/models/Formular.model';
import { ApiConfigModule } from 'src/config/config.module';
import ToiService from './toi.service';


@Module({
  imports: [ApiConfigModule, SequelizeModule.forFeature([Toi, Formular])],
  providers: [ToiService],
  controllers: [ToiController],
  exports: [SequelizeModule, ToiService],
})
export class ToiModule implements NestModule {
  private readonly logger = new Logger(ToiModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init ToiModule');
  }
}