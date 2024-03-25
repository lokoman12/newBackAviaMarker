import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import ZoneAM from 'src/db/models/zone.model';
import { ZoneController } from 'src/zone/zone.controller';
import { DeleteZoneController } from './deleteZone.controller';




@Module({
  imports: [SequelizeModule.forFeature([ZoneAM])],
  controllers: [DeleteZoneController],
  exports: [SequelizeModule],
})
export class DeleteZoneModule {}