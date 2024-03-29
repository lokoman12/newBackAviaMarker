import { Injectable } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { Op } from 'sequelize';
import { where } from 'sequelize';
import { SCOUT } from 'src/db/models/scout.model';
//import moment from 'moment';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['a-rpx-appt01.svo.air.loc:9092'],
    });

    this.consumer = this.kafka.consumer({ groupId: 'vega_consumer_group' });
  }

  async init(): Promise<void> {
    await this.consumer.connect();
  }

  async subscribe(topic: string): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: false });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        let obj = JSON.parse(message.value.toString());
        let objForDb = {
          id: obj.omnicommId,
          timeUpdate: obj.dataDate,
          regNum: obj.name,
          speed: obj.speed,
          direction: obj.direction,
          latitude: obj.location.lat,
          longitude: obj.location.long,
        };

        const date = (new Date().getTime()/1000).toFixed(0);

        const fifteenMinutesAgo = Number(date) - 15 * 60;
    console.log(fifteenMinutesAgo)
        await SCOUT.destroy({
          where: {
            t_obn: {
              [Op.lte]: fifteenMinutesAgo,
            },
          },
        });




        const timeDiffMin = (Number(date) - objForDb.timeUpdate) / 60;
        if (timeDiffMin < 15) {
          await SCOUT.upsert({
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
  }
}
