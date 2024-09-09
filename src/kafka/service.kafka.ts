import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { Op } from 'sequelize';
import { ApiConfigService } from 'src/config/api.config.service';
import Scout from 'src/db/models/scout.model';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);

  private kafka: Kafka;
  private consumer: Consumer;
  private kafkaEnabled: boolean = true;

  constructor(private configService: ApiConfigService) {
    try {
      this.kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['a-rpx-appt01.svo.air.loc:9092'],
      });

      // Удаление групп при инициализации, можно обернуть в try-catch
      this.kafka.admin().deleteGroups(['vega_consumer_group']).then(() => {
        console.log('Groups have been deleted');
      }).catch((error) => {
        this.logger.error('Failed to delete groups:', error.message);
      });

      this.consumer = this.kafka.consumer({ groupId: 'vega_consumer_group' });
    } catch (error) {
      this.logger.error('Failed to initialize Kafka:', error.message);
      this.kafkaEnabled = false; // Отключаем Kafka, если не удалось подключиться
    }
  }

  async init(): Promise<void> {
    if (!this.kafkaEnabled) {
      this.logger.warn('Kafka is disabled. Skipping initialization.');
      return;
    }

    try {
      await this.consumer.connect();
      this.logger.log('Kafka consumer connected successfully');
    } catch (error) {
      this.logger.error('Cannot connect to Kafka. Kafka functionality is disabled:', error.message);
      this.kafkaEnabled = false; // Отключаем Kafka, если не удалось подключиться
    }
  }

  async subscribe(topic: string): Promise<void> {
    if (!this.kafkaEnabled) {
      this.logger.warn('Kafka is disabled. Skipping subscription.');
      return;
    }

    try {
      await this.consumer.subscribe({ topic, fromBeginning: false });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const obj = JSON.parse(message.value.toString());
          console.log(obj);

          const objForDb = {
            id: obj.omnicommId,
            timeUpdate: obj.dataDate,
            regNum: obj.name,
            speed: obj.speed,
            direction: obj.direction,
            latitude: obj.location.lat,
            longitude: obj.location.long,
          };

          const date = (new Date().getTime() / 1000).toFixed(0);
          const fifteenMinutesAgo = Number(date) - 15 * 60;

          // Удаление устаревших записей
          await Scout.destroy({
            where: {
              t_obn: {
                [Op.lte]: fifteenMinutesAgo,
              },
            },
          });

          // Обновление данных, если запись актуальна
          const timeDiffMin = (Number(date) - objForDb.timeUpdate) / 60;
          if (timeDiffMin < 15) {
            await Scout.upsert({
              Serial: objForDb.id,
              t_obn: objForDb.timeUpdate,
              GarNum: objForDb.regNum,
              Speed: Number(objForDb.speed),
              Course: Number(objForDb.direction),
              Lat: Number(objForDb.latitude),
              Lon: Number(objForDb.longitude),
            });
          }
        },
      });
    } catch (error) {
      this.logger.error('Failed to subscribe to Kafka topic:', error.message);
    }
  }
}
