import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "src/config/api.config.service";
import { InjectModel } from "@nestjs/sequelize";
import { omit } from 'lodash';
import MeteoHistory from "src/db/models/meteoHistory.model";
import MeteoService from "src/meteo/meteo.service";
import { ExternalScheduler } from "src/scheduler/external.scheduler";

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
    if (configService.isCopyHistoryEnabled()) {
      this.logger.warn(`Включение копирования метео в историю meteoCopyToHistoryCronMask:${this.configService.getMeteoCopyToHistoryCronMask()}`);
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
    const time = new Date();
    this.logger.log(`Копируем meteo в иcторию time:${time}`);
    const rowsForHistory = await this.meteoService.getActualData();

    this.logger.log(`Копируем в историю meteo: ${rowsForHistory.length} строк`);

    const rowsToInsert = rowsForHistory.map(it => {
      return {
        // Опустим колонку id, для хистори таблицы она будет сгенерирована
        ...omit(it, ['id']),
        time,
      };
    });
    await this.meteoHistoryModel.bulkCreate(
      rowsToInsert
    );
    
    // const promises = [];
    // rowsForHistory.forEach(it => {
    //   const record = this.meteoHistoryModel.create({
    //     // Опустим колонку id, для хистори таблицы она будет сгенерирована
    //     ...omit(it, ['id']),
    //     time,
    //   })
    //   promises.push(record);
    // });
    // await Promise.all(promises);
  }

}
