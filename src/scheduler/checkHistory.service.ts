import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import ToiHistory from 'src/db/models/toiHistory.model';
import { Op } from 'sequelize';
import { ApiConfigService } from 'src/config/api.config.service';
import dayjs from '../utils/dayjs';
import { ExternalScheduler } from 'src/scheduler/external.scheduler';
import { DATE_TIME_FORMAT } from 'src/auth/consts';
import MeteoHistory from 'src/db/models/meteoHistory.model';
import StandsHistory from 'src/db/models/standsHistory.model';
import OmnicomHistory from 'src/db/models/scoutHistory.model';
import AznbHistory from 'src/db/models/aznbHistory.model';

@Injectable()
export class CheckHistoryService {
  private readonly logger = new Logger(CheckHistoryService.name);

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    @InjectModel(ToiHistory)
    private readonly toiHistoryModel: typeof ToiHistory,
    @InjectModel(MeteoHistory)
    private readonly meteoHistoryModel: typeof MeteoHistory,
    @InjectModel(StandsHistory)
    private readonly standsHistoryModel: typeof StandsHistory,
    @InjectModel(OmnicomHistory)
    private readonly omnicomHistoryModel: typeof OmnicomHistory,
    @InjectModel(AznbHistory)
    private readonly aznbHistoryModel: typeof AznbHistory,
  ) {
    this.logger.log(`Init controller`);
    this.externalScheduler.addJob(
      'cleanTableHistory',
      this.configService.getToiCheckToHistoryCronMask(),
      this.handleDailyCheck.bind(this),
    );
    this.logger.log('Сервис инициализирован!')
  }

  async handleDailyCheck() {
    this.logger.log('++++++++ Running daily check of ToiHistory records +++++++++++++');

    try {
      const startTime = dayjs.utc()
        .subtract(this.configService.getHowDaySave(), 'days');
      this.logger.log(`Delete all records from history before: ${startTime.format(DATE_TIME_FORMAT)}`);

      await this.toiHistoryModel.destroy({
        where: {
          time: {
            [Op.lt]: startTime.toDate(),
          },
        },
      });

      await this.aznbHistoryModel.destroy({
        where: {
          time: {
            [Op.lt]: startTime.toDate(),
          },
        },
      });

      await this.standsHistoryModel.destroy({
        where: {
          time: {
            [Op.lt]: startTime.toDate(),
          },
        },
      });

      await this.omnicomHistoryModel.destroy({
        where: {
          time: {
            [Op.lt]: startTime.toDate(),
          },
        },
      });

      await this.meteoHistoryModel.destroy({
        where: {
          time: {
            [Op.lt]: startTime.toDate(),
          },
        },
      });

    } catch (error) {
      this.logger.error('Error during daily check:', error);
    }
  }
}
