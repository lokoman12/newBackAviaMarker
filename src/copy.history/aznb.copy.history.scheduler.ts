import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "src/config/api.config.service";
import { InjectModel } from "@nestjs/sequelize";
import { omit } from 'lodash';
import AznbService from "src/aznb/aznb.service";
import AznbHistory from "src/db/models/aznbHistory.model";
import { ExternalScheduler } from "src/scheduler/external.scheduler";

@Injectable()
export default class AznbCopyToHistoryScheduler {
  private readonly logger = new Logger(AznbCopyToHistoryScheduler.name);

  public static copyToHistoryJobName = 'AznbCopyToHistory';

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    private aznbService: AznbService,
    @InjectModel(AznbHistory) private readonly aznbHistoryModel: typeof AznbHistory
  ) {
    this.logger.log('Init controller --------------------------->');
    if (configService.isCopyHistoryEnabled()) {
      this.logger.warn(`Включение копирования азнб в историю aznbCopyToHistoryCronMask:${this.configService.getAznbCopyToHistoryCronMask()}`);
      this.externalScheduler.addJob(
        AznbCopyToHistoryScheduler.copyToHistoryJobName,
        this.configService.getAznbCopyToHistoryCronMask(),
        this.copyToHistory.bind(this)
      );
    } else {
      this.logger.warn('Копирование первички отключено в настройках');
    }
    this.logger.log('Сервис инициализирован! ==================')
  }

  public async copyToHistory() {
    const time = new Date();
    this.logger.log(`Копируем stands в иcторию time:${time}`);
    const rowsForHistory = await this.aznbService.getActualData();

    this.logger.log(`Копируем в историю stands: ${rowsForHistory.length} строк`);

    const rowsToInsert = rowsForHistory.map(it => {
      return {
        // Опустим колонку id, для хистори таблицы она будет сгенерирована
        ...omit(it, ['id']),
        time,
      };
    });
    await this.aznbHistoryModel.bulkCreate(
      rowsToInsert
    );

    // const promises = [];
    // rowsForHistory.forEach(it => {
    //   const record = this.aznbHistoryModel.create({
    //     // Опустим колонку id, для хистори таблицы она будет сгенерирована
    //     ...omit(it, ['id']),
    //     time,
    //   })
    //   promises.push(record);
    // });
    // await Promise.all(promises);
  }

}
