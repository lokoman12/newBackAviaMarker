import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "src/config/api.config.service";
import { ExternalScheduler } from "./external.scheduler";
import OmnicomHistory from "src/db/models/scoutHistory.model";
import { InjectModel } from "@nestjs/sequelize";
import { omit } from 'lodash';
import OmnicomService from "src/omnicom/omnicom.service";
import StandService from "src/stand-aodb/stand.service";
import StandsHistory from "src/db/models/standsHistory.model";
import { log } from "console";

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
    this.externalScheduler.addJob(
      StandsCopyToHistoryScheduler.copyToHistoryJobName,
      this.configService.getStandsCopyToHistoryCronMask(),
      this.omnicomCopyToHistory.bind(this)
    );
    this.logger.log('Сервис инициализирован! ==================')
  }

  public async omnicomCopyToHistory() {
    this.logger.log('Копирование stands в иcторию');
    // this.logger.log('Запуск джобы копирования актуальной третички в историю');
    const rowsForHistory = await this.standService.getActualData();
    const promises = [];

    this.logger.log(`Копируем в историю stands: ${rowsForHistory.length} строк`);

    const time = new Date();
    rowsForHistory.forEach(it => {
      const record = this.standsHistoryModel.create({
        // Опустим колонку id, для хистори таблицы она будет сгенерирована
        ...omit(it, ['id']),
        time,
      })
      promises.push(record);
    });
    await Promise.all(promises);
  }

}
