import { OnApplicationBootstrap } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { KafkaService } from './service.kafka';

@Injectable()
export class KafkaInitializer implements OnApplicationBootstrap {
  constructor(private readonly kafkaService: KafkaService) {}

  async onApplicationBootstrap() {
    await this.kafkaService.init();
    await this.kafkaService.subscribe('omnicomm.changes.dev');
  }
}