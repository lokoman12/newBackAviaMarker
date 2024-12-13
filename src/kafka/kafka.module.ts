import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaInitializer } from './KafkaInitializer';
import { ApiConfigModule } from 'src/config/config.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ApiConfigModule, PrismaModule,],
  providers: [KafkaService, KafkaInitializer,],
  exports: [],
})
export class KafkaModule implements NestModule {
  private readonly logger = new Logger(KafkaModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init KafkaModule');
  }
}