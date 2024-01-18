import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Line } from 'src/db/models/line.model';
import { LineController } from './line.controller';
import { User } from 'src/db/models/user.model';
import { UserController } from './user.controller';

@Module({
  imports: [SequelizeModule.forFeature([Line])],
  controllers: [LineController],
  exports: [SequelizeModule],
})
export class LineModule {}