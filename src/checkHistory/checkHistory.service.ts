import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import ToiHistory from 'src/db/models/toiHistory.model';
import { Op } from 'sequelize';
import { ApiConfigService } from 'src/config/api.config.service';
import dayjs from '../utils/dayjs';
import { ExternalScheduler } from 'src/history/external.scheduler';
@Injectable()
export class CheckHistoryService {
  private readonly log = new Logger(CheckHistoryService.name);

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    @InjectModel(ToiHistory)
    private readonly toiHistoryModel: typeof ToiHistory,
  ) {
    this.log.log('Init controller');
    this.externalScheduler.addJob(
      'cleanTableHistory',
      this.configService.getToiCheckToHistoryCronMask(),
      this.handleDailyCheck.bind(this),
    );
  }

  async handleDailyCheck() {
    this.log.log('Running daily check for ToiHistory records.');

    try {
      const lastHistoryEntry = await this.toiHistoryModel.findOne({
        order: [['time', 'ASC']],
      });

      if (!lastHistoryEntry) {
        this.log.log('No history entries found.');
        return;
      }

      const startTime = dayjs
        .utc(lastHistoryEntry.time)
        .subtract(this.configService.getHowDaySave(), 'days');
      await this.toiHistoryModel.destroy({
        where: {
          time: {
            [Op.lte]: startTime,
          },
        },
      });
    } catch (error) {
      this.log.error('Error during daily check:', error);
    }
  }
}
