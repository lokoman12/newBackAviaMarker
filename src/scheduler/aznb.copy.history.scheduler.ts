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
import AznbService from "src/aznb/aznb.service";
import AznbHistory from "src/db/models/aznbHistory.model";

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
    this.externalScheduler.addJob(
      AznbCopyToHistoryScheduler.copyToHistoryJobName,
      this.configService.getAznbCopyToHistoryCronMask(),
      this.copyToHistory.bind(this)
    );
    this.logger.log('Сервис инициализирован! ==================')
  }

  public async copyToHistory() {
    this.logger.log('Копирование stands в иcторию');
    // this.logger.log('Запуск джобы копирования актуальной третички в историю');
    const rowsForHistory = await this.aznbService.getActualData();
    const promises = [];

    this.logger.log(`Копируем в историю stands: ${rowsForHistory.length} строк`);

    const time = new Date();
    rowsForHistory.forEach(it => {
      const record = this.aznbHistoryModel.create({
        // Опустим колонку id, для хистори таблицы она будет сгенерирована
        ...omit(it, ['id']),
        time,
      })
      promises.push(record);
    });
    await Promise.all(promises);
  }

}