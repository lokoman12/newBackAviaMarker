import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OmnicomController } from './omnicom.controller';
import { ApiConfigModule } from 'src/config/config.module';
import OmnicomService from './omnicom.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [ApiConfigModule, PrismaModule,],
  providers: [OmnicomService,],
  controllers: [OmnicomController],
  exports: [OmnicomService],
})
export class OmnicomModule implements NestModule {
  private readonly logger = new Logger(OmnicomModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init OmnicomModule');
  }
}