import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './db/sequelize.config';
import { LineModule } from './line/user.module';
import { PointModule } from './Point/user.module';
import { ToiModule } from './Toi/user.module';
import { AlarmModule } from './alarm/user.module';
import { SaveAlaramModule } from './saveAlaram/user.module';

@Module({
  imports: [SequelizeModule.forRoot(sequelizeConfig), LineModule, PointModule, ToiModule, AlarmModule, SaveAlaramModule],
  controllers: [],
})
export class AppModule {}