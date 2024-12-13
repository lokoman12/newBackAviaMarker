import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AznbController } from './aznb.controller';
import { ApiConfigModule } from 'src/config/config.module';
import AznbService from './aznb.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [ApiConfigModule, PrismaModule,],
  providers: [AznbService,],
  controllers: [AznbController],
  exports: [AznbService],
})
export class AznbModule implements NestModule {
  private readonly logger = new Logger(AznbModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init AznbModule');
  }
}