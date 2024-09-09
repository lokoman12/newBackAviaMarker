import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { KafkaService } from './service.kafka';
import { ApiConfigService } from 'src/config/api.config.service';


@Injectable()
export class KafkaInitializer implements OnApplicationBootstrap {
  private readonly logger = new Logger(KafkaInitializer.name);
  constructor(
    private configService: ApiConfigService,
    private readonly kafkaService: KafkaService,
  ) { }

  async onApplicationBootstrap() {
    try {
      await this.kafkaService.init();
      await this.kafkaService.subscribe('omnicomm.changes');
    } catch (e) {
      this.logger.error('Can not init and start Kafka. Functionality was disabled!');
    }
  }
}