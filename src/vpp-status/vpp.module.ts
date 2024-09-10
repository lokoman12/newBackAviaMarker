import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import VppStatus from 'src/db/models/vppStatus.model';
import { VppStatusController } from './vpp.status.controller';
import { VppChangeStatusController } from './vpp.status.change.controller';
import VppService from './vpp.service';


@Module({
  imports: [SequelizeModule.forFeature([VppStatus]),],
  providers: [VppService,],
  controllers: [VppStatusController, VppChangeStatusController,],
  exports: [VppService, SequelizeModule,],
})
export class VppStatusModule { }