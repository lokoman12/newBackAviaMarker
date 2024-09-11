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

  public static copyToHistoryJobName = 'MeteoCopyToHistory';

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    private meteoService: MeteoService,
    @InjectModel(MeteoHistory) private readonly meteoHistoryModel: typeof MeteoHistory
  ) {
    this.logger.log('Init controller --------------------------->');
    if (!configService.getDisableCopyHistory()) {
      this.logger.warn('Включение копирования метео в историю');
      this.externalScheduler.addJob(
        MeteoCopyToHistoryScheduler.copyToHistoryJobName,
        this.configService.getMeteoCopyToHistoryCronMask(),
        this.copyToHistory.bind(this)
      );
    } else {
      this.logger.warn('Копирование метео отключено в настройках');
    }
    this.logger.log('Сервис инициализирован! ==================')
  }

  public async copyToHistory() {
    // this.logger.log('Копируем meteo в иcторию');
    // this.logger.log('Запуск джобы копирования актуальной третички в историю');
    const rowsForHistory = await this.meteoService.getActualData();
    const promises = [];

    this.logger.log(`Копируем в историю meteo: ${rowsForHistory.length} строк`);

    const time = new Date();
    rowsForHistory.forEach(it => {
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
