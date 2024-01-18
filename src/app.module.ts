import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TestController } from './controllers/test/test.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './scripts/db/sequelize.config';  // Импортируем конфигурацию
import { databaseProviders } from './scripts/db/database.service';

@Module({
  imports: [SequelizeModule.forRoot(sequelizeConfig)],  // Используем конфигурацию
  controllers: [TestController],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class AppModule {}