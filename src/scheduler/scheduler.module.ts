import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiConfigModule } from 'src/config/config.module';
import { ExternalScheduler } from './external.scheduler';
import { ToadScheduler } from 'toad-scheduler';
import { EMPTY_ARRAY } from 'src/consts/common';

@Module({
  providers: [ExternalScheduler, ToadScheduler,],
  imports: [ApiConfigModule,],
  controllers: EMPTY_ARRAY,
  exports: [ExternalScheduler, ToadScheduler,],
})
export class SchedulerModule implements NestModule {
  private readonly logger = new Logger(SchedulerModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init SchedulerModule');
  }
}