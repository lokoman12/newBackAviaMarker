import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { ToiController1 } from './omnicom.controller';
import Toi from 'src/db/models/toi.model';
import Formular from 'src/db/models/Formular.model';
import { KafkaService } from './service.kafka';
import { KafkaInitializer } from './KafkaInitializer';
import { ApiConfigModule } from 'src/config/config.module';

@Module({
  providers: [KafkaService, KafkaInitializer],
  imports: [ApiConfigModule, SequelizeModule.forFeature([Toi, Formular])],
  // controllers: [ToiController1],
  exports: [SequelizeModule],
})
export class KafkaModule implements NestModule {
  private readonly logger = new Logger(KafkaModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init KafkaModule');
  }
}