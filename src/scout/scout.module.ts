import { Module } from '@nestjs/common';
import { ScoutController } from './scout.controller';
import ScoutService from './scout.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  providers: [ScoutService],
  controllers: [ScoutController],
  exports: [ScoutService],
})
export class ScoutModule {}