import { Module } from '@nestjs/common';
import { VppStatusController } from './vpp.status.controller';
import { VppChangeStatusController } from './vpp.status.change.controller';
import VppService from './vpp.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ApiConfigModule } from 'src/config/config.module';


@Module({
  imports: [ApiConfigModule, PrismaModule,],
  providers: [VppService,],
  controllers: [VppStatusController, VppChangeStatusController,],
  exports: [VppService,],
})
export class VppStatusModule { }