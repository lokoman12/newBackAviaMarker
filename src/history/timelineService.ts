import { Injectable, Logger, NotAcceptableException } from "@nestjs/common";
import HistoryService from "./historyService";
import { RecordStatusService } from "./record.status.service";
import { TimelineRecordDto } from "./timeline.record.dto";
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
      this.logger.error('Текущий пользователь не находится в статусе воспроизведения записи');
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

  async tryFillInUserHistoryTable(login: string, startTime: Date, endTime: Date, velocity: number): Promise<TimelineRecordDto> {
    // Проверяем, вдруг юзер уже получает историю, а значит - за ним закреплена таблица
    const inRecordStatus = await this.recordStatusService.isInRecordStatus(login);

    // Пробуем найти и выделить свободную таблицу
    if (!inRecordStatus) {
      // Ищём свободный номер таблицы
      const nextFreeTableNumber = await this.historyService.getNextFreeTableNumber();
      if (nextFreeTableNumber > NO_FREE_HISTORY_RECORD_TABLE) {
        try {
          await this.historyService.prepareHistoryForRecordTable(nextFreeTableNumber, startTime, endTime);

          // Получим номер первого и последнего шагов из сгенерированной ранее таблицы
          const { startId, endId, } = await this.historyService.getRecordStatusInfo(
            nextFreeTableNumber,
          );

          // Сохраним сеттинги для пользователя, который пытается включить запись: время начала и завершения, текущий шаг и т.д.
          const recordDto = new TimelineRecordDto(
            login, startTime, endTime, startTime,
            startId, endId, startId,
            velocity, nextFreeTableNumber)
          await this.recordStatusService.setRecordStatus(recordDto);

          this.logger.log(`History info: nextFreeTableNumber: ${nextFreeTableNumber}, startId: ${startId}, endId: ${endId}`);

          return recordDto;
        } catch (e) {
          this.logger.error('Не смогли захватить следующую свободную таблицу истории');
          throw new NotAcceptableException('Не смогли захватить следующую свободную таблицу истории');
        }
      }
    } else {
      this.logger.error(`Пользователь ${login} уже захватил таблицу`);
      throw new NotAcceptableException(`Пользователь ${login} уже захватил таблицу`);
    }
  }
}

export default TimelineService;
