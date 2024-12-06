import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "src/config/api.config.service";
import ToiService from "src/toi/toi.service";
import ToiHistory from "src/db/models/toiHistory.model";
import { InjectModel } from "@nestjs/sequelize";
import { omit } from 'lodash';
import { ExternalScheduler } from "src/scheduler/external.scheduler";

@Injectable()
export default class ToiCopyToHistoryScheduler {
  private readonly logger = new Logger(ToiCopyToHistoryScheduler.name);

  public static copyToHistoryJobName = 'ToiCopyToHistory';

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    private toiService: ToiService,
    @InjectModel(ToiHistory) private readonly toiHistoryModel: typeof ToiHistory
  ) {
    this.logger.log('Init controller --------------------------->');

    if (configService.isCopyHistoryEnabled()) {
      this.logger.warn(`Включение копирования третички в историю, toiCopyToHistoryCronMask:${this.configService.getToiCopyToHistoryCronMask()}`);
      this.externalScheduler.addJob(
        ToiCopyToHistoryScheduler.copyToHistoryJobName,
        this.configService.getToiCopyToHistoryCronMask(),
        this.copyToHistory.bind(this)
      );
    } else {
      this.logger.warn('Копирование третички отключено в настройках');
    }

    this.logger.log('Сервис инициализирован! ==================')
  }

  public async copyToHistory() {
    const time = new Date();
    this.logger.log(`Копирование третички в иcторию ${time}`);
    const rowsForHistory = await this.toiService.getActualData();

    this.logger.log(`Копируем в историю toi: ${rowsForHistory.length} строк`);

    const rowsToInsert = rowsForHistory.map(it => {
      return {
        ...omit(it, ['id']),
        time,
      };
    });
    await this.toiHistoryModel.bulkCreate(
      rowsToInsert
    );

    // const promises = [];
    // rowsForHistory.forEach(it => {
    //   const record = this.toiHistoryModel.create({
    //     // Опустим колонку id третички, для хистори таблицы она будет сгенерирована
    //     ...omit(it, ['id']),
    //     time,
    //   })
    //   promises.push(record);
    // });
    // await Promise.all(promises);
  }

}
