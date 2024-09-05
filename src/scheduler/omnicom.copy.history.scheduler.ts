import { Injectable, Logger } from '@nestjs/common';
import { ApiConfigService } from 'src/config/api.config.service';
import { ExternalScheduler } from './external.scheduler';
import OmnicomHistory from 'src/db/models/scoutHistory.model';
import { InjectModel } from '@nestjs/sequelize';
import { omit } from 'lodash';
import OmnicomService from 'src/omnicom/omnicom.service';

@Injectable()
export default class OmnicomCopyToHistoryScheduler {
  private readonly logger = new Logger(OmnicomCopyToHistoryScheduler.name);

  public static copyToHistoryJobName = 'OmnicomCopyToHistory';

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    private omnicomService: OmnicomService,
    @InjectModel(OmnicomHistory)
    private readonly omnicomHistoryModel: typeof OmnicomHistory,
  ) {
    this.logger.log('Init controller --------------------------->');
    this.externalScheduler.addJob(
      OmnicomCopyToHistoryScheduler.copyToHistoryJobName,
      this.configService.getOmnicomCopyToHistoryCronMask(),
      this.copyToHistory.bind(this),
    );
    this.logger.log('Сервис инициализирован! ==================');
  }

  public async copyToHistory() {
    this.logger.log('Копирование omnicom в иcторию');
    // this.logger.log('Запуск джобы копирования актуальной третички в историю');
    const rowsForHistory = await this.omnicomService.getActualData();
    const promises = [];

    this.logger.log(
      `Копируем в историю omnicom: ${rowsForHistory.length} строк`,
    );

    const time = new Date();
    rowsForHistory.forEach((it) => {
      const record = this.omnicomHistoryModel.create({
        // Опустим колонку id, для хистори таблицы она будет сгенерирована
        time,
        Serial: it.Serial,
        GarNum: it.GarNum,
        t_obn: it.t_obn,
        Lat: it.Lat,
        Lon: it.Lon,
        Speed: it.Speed,
        Course: it.Course,
      });
      promises.push(record);
    });
    await Promise.all(promises);
  }
}
