import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Retd } from 'src/db/models/retd.model';
import { RetdController } from './toi.controller';


@Module({
  imports: [SequelizeModule.forFeature([Retd])],
  controllers: [RetdController],
  exports: [SequelizeModule],
})
export class RetdModule {}