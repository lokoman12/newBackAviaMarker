import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import ToiHistory from 'src/db/models/toiHistory.model';
import { Op } from 'sequelize';
import { ApiConfigService } from 'src/config/api.config.service';
import dayjs from '../utils/dayjs';
import { ExternalScheduler } from 'src/scheduler/external.scheduler';
import { DATE_TIME_FORMAT } from 'src/auth/consts';

@Injectable()
export class CheckHistoryService {
  private readonly logger = new Logger(CheckHistoryService.name);

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    @InjectModel(ToiHistory)
    private readonly toiHistoryModel: typeof ToiHistory,
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
    } catch (error) {
      this.logger.error('Error during daily check:', error);
    }
  }
}
