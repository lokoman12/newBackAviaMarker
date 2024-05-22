import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import VppStatus from 'src/db/models/vppStatus.model';
import { RdChangeStatusController } from './rd.status.change.controller';
import { RdStatusController } from './rd.status.controller';
import RdStatus from 'src/db/models/rdStatus';

@Module({
  imports: [SequelizeModule.forFeature([RdStatus])],
  controllers: [RdStatusController, RdChangeStatusController],
  exports: [SequelizeModule],
})
export class RdStatusModule {}
