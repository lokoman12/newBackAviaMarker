import { Module } from '@nestjs/common';
import { TestController } from './controllers/test/test.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './db/sequelize.config';
import { databaseProviders } from './db/database.service';
import { LineController } from './controllers/Line/line.controller';

@Module({
  imports: [SequelizeModule.forRoot(sequelizeConfig)],
  controllers: [TestController, LineController],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class AppModule {}