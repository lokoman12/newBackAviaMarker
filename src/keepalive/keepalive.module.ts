import { Module } from '@nestjs/common';
import { HealthStatusController } from './keepalive.controller';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [PrismaModule,],
  controllers: [HealthStatusController],
})
export class HealthStatusModule { }