import { Module } from '@nestjs/common';
import { StripsController } from './strips.controller';
import StripsService from './strips.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [PrismaModule,],
  providers: [StripsService],
  controllers: [StripsController],
  exports: [StripsService],
})
export class StripsModule {}