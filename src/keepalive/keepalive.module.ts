import { Module } from '@nestjs/common';
import { HealthStatusController } from './keepalive.controller';


@Module({
  controllers: [HealthStatusController],
})
export class HealthStatusModule { }