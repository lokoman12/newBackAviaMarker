import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "src/config/api.config.service";
import { ExternalScheduler } from "./external.scheduler";
import ToiService from "src/toi/toi.service";
import ToiHistory from "src/db/models/toiHistory.model";
import { InjectModel } from "@nestjs/sequelize";
import { omit } from 'lodash';

@Injectable()
export default class ToiCopyToHistoryScheduler {
  private readonly logger = new Logger(ToiCopyToHistoryScheduler.name);

  public static toiCopyToHistoryJobName = 'ToiCopyToHistory';

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    private toiService: ToiService,
    @InjectModel(ToiHistory) private readonly toiHistoryModel: typeof ToiHistory
  ) {
    this.logger.log('Сервис инициализирован!')

    this.externalScheduler.addJob(
      ToiCopyToHistoryScheduler.toiCopyToHistoryJobName,
      this.configService.getToiCheckToHistoryCronMask(),
      this.toiCopyToHistory.bind(this)
    );
  }

  public async toiCopyToHistory() {
    // this.logger.log('Запуск джобы копирования актуальной третички в историю');
    const toiListForHistory = await this.toiService.getActualClientToi();
    const promises = [];

    const time = new Date();
    toiListForHistory.forEach(it => {
      const record = this.toiHistoryModel.create({
        // Опустим колонку id третички, для хистори таблицы она будет сгенерирована
        ...omit(it, ['id']),
        time,
      })
      promises.push(record);
    });
    await Promise.all(promises);
  }

}
