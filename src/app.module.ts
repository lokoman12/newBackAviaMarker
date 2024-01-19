import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './db/sequelize.config';
import { LineModule } from './line/user.module';
import { PointModule } from './Point/user.module';

@Module({
  imports: [SequelizeModule.forRoot(sequelizeConfig), LineModule, PointModule],
  controllers: [],
})
export class AppModule {}