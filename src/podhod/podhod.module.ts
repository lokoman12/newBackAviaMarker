import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PodhodController } from './podhod.controller';
import PodhodService from './podhod.service';
import { PrismaModule } from 'src/prisma/prisma.module';


// Нет для шарика
@Module({
  imports: [PrismaModule,],
  providers: [PodhodService,],
  controllers: [PodhodController,],
  exports: [PodhodService,],
})
export class PodhodModule implements NestModule {
  private readonly logger = new Logger(PodhodModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init PodhodModule');
  }
}