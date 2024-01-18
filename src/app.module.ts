import { Module } from '@nestjs/common';
import { TestController } from './controllers/test/test.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './db/sequelize.config';
import { LineModule } from './line/user.module';

@Module({
  imports: [SequelizeModule.forRoot(sequelizeConfig), LineModule],
  controllers: [TestController],
})
export class AppModule {}