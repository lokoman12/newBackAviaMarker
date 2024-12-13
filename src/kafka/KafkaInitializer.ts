import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ApiConfigService } from 'src/config/api.config.service';


@Injectable()
export class KafkaInitializer implements OnApplicationBootstrap {
  private readonly logger = new Logger(KafkaInitializer.name);
  constructor(
    private configService: ApiConfigService,
    private readonly kafkaService: KafkaService,
  ) { }

  async onApplicationBootstrap() {
      await this.kafkaService.init();
      await this.kafkaService.subscribe('omnicomm.changes');
  }
}