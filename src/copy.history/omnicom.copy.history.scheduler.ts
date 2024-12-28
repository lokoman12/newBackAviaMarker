import { Injectable, Logger } from '@nestjs/common';
import { ApiConfigService } from 'src/config/api.config.service';
import OmnicomHistory from 'src/db/models/scoutHistory.model';
import { InjectModel } from '@nestjs/sequelize';
import { omit } from 'lodash';
import OmnicomService from 'src/omnicom/omnicom.service';
import { ExternalScheduler } from 'src/scheduler/external.scheduler';

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
    // this.logger.log('Init controller');
    if (configService.isCopyHistoryEnabled()) {
      this.logger.warn(`Включение копирования машинок в историю ${this.configService.getOmnicomCopyToHistoryCronMask()}`);
      this.externalScheduler.addJob(
        OmnicomCopyToHistoryScheduler.copyToHistoryJobName,
        this.configService.getOmnicomCopyToHistoryCronMask(),
        this.copyToHistory.bind(this),
      );
    } else {
      this.logger.warn('Копирование машинок отключено в настройках');
    }
    // this.logger.log('Сервис инициализирован! ==================');
  }

  public async copyToHistory() {
    const time = new Date();
    this.logger.log(`Копируем omnicom в иcторию time:${time}`);
    const rowsForHistory = await this.omnicomService.getActualData();

    this.logger.log(`Копируем в историю omnicom: ${rowsForHistory.length} строк`);

    const rowsToInsert = rowsForHistory.map(it => {
      return {
        // Опустим колонку id, для хистори таблицы она будет сгенерирована
        time,
        Serial: it.Serial,
        GarNum: it.GarNum,
        t_obn: it.t_obn,
        Lat: it.Lat,
        Lon: it.Lon,
        Speed: it.Speed,
        Course: it.Course,
      };
    });
    await this.omnicomHistoryModel.bulkCreate(
      rowsToInsert
    );

    // const promises = [];
    // rowsForHistory.forEach((it) => {
    //   const record = this.omnicomHistoryModel.create({
    //     // Опустим колонку id, для хистори таблицы она будет сгенерирована
    //     time,
    //     Serial: it.Serial,
    //     GarNum: it.GarNum,
    //     t_obn: it.t_obn,
    //     Lat: it.Lat,
    //     Lon: it.Lon,
    //     Speed: it.Speed,
    //     Course: it.Course,
    //   });
    //   promises.push(record);
    // });
    // await Promise.all(promises);
  }
}
