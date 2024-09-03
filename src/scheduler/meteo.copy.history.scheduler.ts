import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "src/config/api.config.service";
import { ExternalScheduler } from "./external.scheduler";
import { InjectModel } from "@nestjs/sequelize";
import { omit } from 'lodash';
import OmnicomService from "src/omnicom/omnicom.service";
import MeteoHistory from "src/db/models/meteoHistory.model";
import MeteoService from "src/meteo/meteo.service";

@Injectable()
export default class MeteoCopyToHistoryScheduler {
  private readonly logger = new Logger(MeteoCopyToHistoryScheduler.name);

  public static meteoCopyToHistoryJobName = 'MeteoCopyToHistory';

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    private meteoService: MeteoService,
    @InjectModel(MeteoHistory) private readonly meteoHistoryModel: typeof MeteoHistory
  ) {
    this.logger.log('Init controller --------------------------->');
    this.externalScheduler.addJob(
      MeteoCopyToHistoryScheduler.meteoCopyToHistoryJobName,
      this.configService.getToiCopyToHistoryCronMask(),
      this.meteoCopyToHistory.bind(this)
    );
    this.logger.log('Сервис инициализирован! ==================')
  }

  public async meteoCopyToHistory() {
    this.logger.log('Копирование meteo в иcторию');
    // this.logger.log('Запуск джобы копирования актуальной третички в историю');
    const meteoListForHistory = await this.meteoService.getActualMeteo();
    const promises = [];

    const time = new Date();
    meteoListForHistory.forEach(it => {
      const record = this.meteoHistoryModel.create({
        // Опустим колонку id, для хистори таблицы она будет сгенерирована
        ...omit(it, ['id']),
        time,
      })
      promises.push(record);
    });
    await Promise.all(promises);
  }

}
