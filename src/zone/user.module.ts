import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZoneController } from './zone.controller';
import { ZoneAM } from 'src/db/models/zone.model';




@Module({
  imports: [SequelizeModule.forFeature([ZoneAM])],
  controllers: [ZoneController],
  exports: [SequelizeModule],
})
export class ZoneModule {}