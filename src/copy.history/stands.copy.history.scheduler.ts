import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "src/config/api.config.service";
import { InjectModel } from "@nestjs/sequelize";
import { omit } from 'lodash';
import StandService from "src/stand-aodb/stand.service";
import StandsHistory from "src/db/models/standsHistory.model";
import { ExternalScheduler } from "src/scheduler/external.scheduler";

@Injectable()
export default class StandsCopyToHistoryScheduler {
  private readonly logger = new Logger(StandsCopyToHistoryScheduler.name);

  public static copyToHistoryJobName = 'StandsCopyToHistory';

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    private standService: StandService,
    @InjectModel(StandsHistory) private readonly standsHistoryModel: typeof StandsHistory
  ) {
    this.logger.log('Init controller --------------------------->');

    if (configService.isCopyHistoryEnabled()) {
      this.logger.warn(`Включение копирования парковок в историю standsCopyToHistoryCronMask:${this.configService.getStandsCopyToHistoryCronMask()}`);
      this.externalScheduler.addJob(
        StandsCopyToHistoryScheduler.copyToHistoryJobName,
        this.configService.getStandsCopyToHistoryCronMask(),
        this.copyToHistory.bind(this)
      );
    } else {
      this.logger.warn('Копирование парковкок отключено в настройках');
    }
    this.logger.log('Сервис инициализирован! ==================')
  }

  public async copyToHistory() {
    const time = new Date();
    this.logger.log(`Копируем stands в иcторию time:${time}`);
    const rowsForHistory = await this.standService.getActualData();

    this.logger.log(`Копируем в историю stands: ${rowsForHistory.length} строк`);

    const rowsToInsert = rowsForHistory.map(it => {
      return {
        // Опустим колонку id, для хистори таблицы она будет сгенерирована
        ...omit(it, ['id']),
        time,
      };
    });
    await this.standsHistoryModel.bulkCreate(
      rowsToInsert
    );

    // const promises = [];
    // rowsForHistory.forEach(it => {
    //   const record = this.standsHistoryModel.create({
    //     // Опустим колонку id, для хистори таблицы она будет сгенерирована
    //     ...omit(it, ['id']),
    //     time,
    //   })
    //   promises.push(record);
    // });
    // await Promise.all(promises);
  }

}
