import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "src/config/api.config.service";
import { ExternalScheduler } from "./external.scheduler";
import OmnicomHistory from "src/db/models/scoutHistory.model";
import { InjectModel } from "@nestjs/sequelize";
import { omit } from 'lodash';
import OmnicomService from "src/omnicom/omnicom.service";

@Injectable()
export default class OmnicomCopyToHistoryScheduler {
  private readonly logger = new Logger(OmnicomCopyToHistoryScheduler.name);

  public static omnicomCopyToHistoryJobName = 'OmnicomCopyToHistory';

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    private omnicomService: OmnicomService,
    @InjectModel(OmnicomHistory) private readonly omnicomHistoryModel: typeof OmnicomHistory
  ) {
    this.logger.log('Init controller --------------------------->');
    this.externalScheduler.addJob(
      OmnicomCopyToHistoryScheduler.omnicomCopyToHistoryJobName,
      this.configService.getToiCopyToHistoryCronMask(),
      this.omnicomCopyToHistory.bind(this)
    );
    this.logger.log('Сервис инициализирован! ==================')
  }

  public async omnicomCopyToHistory() {
    this.logger.log('Копирование omnicom в иcторию');
    // this.logger.log('Запуск джобы копирования актуальной третички в историю');
    const omnicomListForHistory = await this.omnicomService.getActualOmnicom();
    const promises = [];

    const time = new Date();
    omnicomListForHistory.forEach(it => {
      const record = this.omnicomHistoryModel.create({
        // Опустим колонку id, для хистори таблицы она будет сгенерирована
        ...omit(it, ['id']),
        time,
      })
      promises.push(record);
    });
    await Promise.all(promises);
  }

}
