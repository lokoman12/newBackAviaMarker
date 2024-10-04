import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiConfigModule } from 'src/config/config.module';
import { ExternalScheduler } from './external.scheduler';
import { ToadScheduler } from 'toad-scheduler';

@Module({
  providers: [ExternalScheduler, ToadScheduler,],
  imports: [ApiConfigModule,],
  controllers: [],
  exports: [ExternalScheduler, ToadScheduler,],
})
export class SchedulerModule implements NestModule {
  private readonly logger = new Logger(SchedulerModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init SchedulerModule');
  }
}