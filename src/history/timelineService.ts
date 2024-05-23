import { Injectable, Logger, NotAcceptableException } from "@nestjs/common";
import HistoryService from "./historyService";
import { RecordStatusService } from "./record.status.service";
import { TimelineRecordDto } from "./timeline.record.dto";
import { getCopyHistoryName } from "./utis";
import { NO_FREE_HISTORY_RECORD_TABLE } from "./consts";
import ToiHistory from "src/db/models/toiHistory.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
class TimelineService {
  private readonly logger = new Logger(TimelineService.name);

  constructor(
    private readonly historyService: HistoryService,
    private readonly recordStatusService: RecordStatusService,
    @InjectModel(ToiHistory) private readonly toiHistoryModel: typeof ToiHistory
  ) {
    this.logger.log('Сервис инициализирован!')
  }

  async getCurrentFormularFromRecord(login: string) {
    const recordStatus = await this.recordStatusService.getRecordStatus(login);
    if (!recordStatus) {
      throw new NotAcceptableException('Текущий пользователь не находится в статусе воспроизведения записи');
    }

    const currentTime = recordStatus.currentTime;
    this.toiHistoryModel.findOne({
      raw: true,
      where: {
        time: currentTime,
      },
    });

    return [];
  }

  async tryFillInUserHistoryTable(login: string, startTime: Date, endTime: Date, velocity: number): Promise<number> {
    // Проверяем, вдруг юзер уже получает историю, а значит - за ним закреплена таблица
    const inRecordStatus = await this.recordStatusService.isInRecordStatus(login);

    // Пробуем найти и выделить свободную таблицу
    if (!inRecordStatus) {
      // Ищём свободный номер таблицы
      const nextFreeTableNumber = await this.historyService.getNextFreeTableNumber();
      if (nextFreeTableNumber > NO_FREE_HISTORY_RECORD_TABLE) {
        try {
          await this.historyService.prepareHistoryForRecordTable(nextFreeTableNumber, startTime, endTime);
          const dto = new TimelineRecordDto(login, startTime, endTime, startTime, velocity, nextFreeTableNumber);
          await this.recordStatusService.setRecordStatus(dto);
          const taskName = getCopyHistoryName(nextFreeTableNumber);
          this.logger.log(`Следующий свободный номер таблицы истории: ${nextFreeTableNumber}`);
          return nextFreeTableNumber;
        } catch (e) {
          throw new NotAcceptableException('Не смогли захватить следующую свободную таблицу истории');
        }
      }
    } else {
      throw new NotAcceptableException(`Пользователь ${login} уже захватил таблицу`);
    }
  }
}

export default TimelineService;
