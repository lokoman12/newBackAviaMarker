import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RdStatusController } from './rd.status.controller';
import { RdStatusService } from './rd.status.service';

@Module({
  imports: [PrismaModule,],
  controllers: [RdStatusController,],
  providers: [RdStatusService,],
  exports: [],
})
export class RdStatusModule { }
