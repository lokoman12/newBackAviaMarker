import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ToiController } from './toi.controller';
import { ApiConfigModule } from 'src/config/config.module';
import ToiService from './toi.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ApiConfigModule, PrismaModule,],
  providers: [ToiService],
  controllers: [ToiController],
  exports: [ToiService],
})
export class ToiModule implements NestModule {
  private readonly logger = new Logger(ToiModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init ToiModule');
  }
}