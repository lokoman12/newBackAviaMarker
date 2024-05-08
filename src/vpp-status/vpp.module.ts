import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import VppStatus from 'src/db/models/vppStatus.model';
import { VppStatusController } from './vpp.status.controller';


@Module({
  imports: [SequelizeModule.forFeature([VppStatus])],
  controllers: [VppStatusController],
  exports: [SequelizeModule],
})
export class VppStatusModule {}