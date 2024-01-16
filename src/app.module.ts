import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TestController } from './controllers/test/test.controller';


@Module({
  imports: [],
  controllers: [TestController],
})
export class AppModule {}
