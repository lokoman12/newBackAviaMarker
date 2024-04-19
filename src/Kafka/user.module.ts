import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ToiController } from './omnicom.controller';
import Toi from 'src/db/models/toi.model';
import Formular from 'src/db/models/Formular.model';
import { KafkaService } from './service.kafka';
import { KafkaInitializer } from './KafkaInitializer';
import { ApiConfigModule } from 'src/config/config.module';


@Module({
  providers: [KafkaService, KafkaInitializer],
  imports: [ApiConfigModule, SequelizeModule.forFeature([Toi, Formular])],
  controllers: [ToiController],
  exports: [SequelizeModule],
})
export class KafkaModule {}