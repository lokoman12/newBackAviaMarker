import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MeteoController } from './meteo.controller';
import MeteoService from './meteo.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [PrismaModule,],
  providers: [MeteoService],
  controllers: [MeteoController],
  exports: [MeteoService],
})
export class MeteoModule implements NestModule {
  private readonly logger = new Logger(MeteoModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init ToiModule');
  }
}