import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Toi } from 'src/db/models/toi.model';
import { Formular } from 'src/db/models/Formular.model';
import { KafkaService } from './service.kafka';
import { KafkaInitializer } from './KafkaInitializer';
import { SCOUT } from 'src/db/models/scout.model';



@Module({
  providers: [KafkaService, KafkaInitializer],
  imports: [SequelizeModule.forFeature([SCOUT])],
  exports: [SequelizeModule],
})
export class KafkaModule {}