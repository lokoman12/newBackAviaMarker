import { Module } from '@nestjs/common';
import { StandController } from './stand.controller';
import StandService from './stand.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [PrismaModule,],
  providers: [StandService],
  controllers: [StandController],
  exports: [StandService],
})
export class StandsModule { }