import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZoneAM } from 'src/db/models/zone.model';
import { ZoneController } from 'src/zone/zone.controller';
import { SaveZoneController } from './saveZone.controller';




@Module({
  imports: [SequelizeModule.forFeature([ZoneAM])],
  controllers: [SaveZoneController],
  exports: [SequelizeModule],
})
export class SaveZoneModule {}