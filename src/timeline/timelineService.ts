import { Injectable, Logger } from "@nestjs/common";

@Injectable()
class TimelineService {
  private readonly logger = new Logger(TimelineService.name);

  constructor(
  ) {
    this.logger.log('Сервис инициализирован!')
  }

  // async trySetRecordStatus(login: string, startTime: Date, endTime: Date, velocity: number): Promise<number> {
  //   // Проверяем, вдруг юзер уже получает историю, а значит - за ним закреплена таблица
  //   const recordStatus = await this.recordStatusService.isInRecordStatus(login);

  //   // Пробуем найти и выделить свободную таблицу
  //   if (!recordStatus) {
  //     // Использованные номера таблиц
  //     let usedTableNumbers = await this.settingsService
  //       .getSettingValuesByName(RECORD_SETTING_PROPERTY_NAME);
  //     usedTableNumbers = usedTableNumbers
  //       .map(it => parseInt(it.value))
  //       .filter(it => !isNaN(it)) as Array<number>;
  //     // Все имеющиеся номера
  //     const allTableNumbers = Array.from(
  //       { length: this.historyRecordTablesNumber },
  //       (_, index) => index
  //     ) as Array<number>;
  //     // Свободные
  //     const freeTableNumbers = difference(allTableNumbers, usedTableNumbers)
  //       .sort((x, y) => x - y);

  //     // Ищём свободный номер таблицы
  //     if (freeTableNumbers.length > 0) {
  //       const nextFreeTableNumber = head(freeTableNumbers);
  //       this.logger.log('nextFreeTableNumber', nextFreeTableNumber);
  //       try {
  //         await this.historyService.prepareHistoryForRecordTable(nextFreeTableNumber, startTime, endTime);
  //         const dto = new TimelineRecordDto(login, startTime, endTime, startTime, velocity, nextFreeTableNumber);
  //         await this.recordStatusService.setRecordStatus(dto);
  //         const taskName = getCopyHistoryName(nextFreeTableNumber);
  //         this.timeScheduler.addJob(
  //           taskName,
  //           `*/${HISTORY_COPY_TIME_INTERVAL_SEC} * * * * *`,
  //           async () => {
  //             await this.actualAirNavDataService.copyHistoryToActualDataForRecordingUser(login);
  //           }
  //         );
  //       } catch (e) {
  //         this.logger.error('Не смогли захватить следующую свободную таблицу истории');
  //         return NO_FREE_HISTORY_RECORD_TABLE;
  //       }

  //       this.logger.log('Следующий свободный номер таблицы истории', nextFreeTableNumber);
  //       return nextFreeTableNumber;
  //     }
  //   } else {
  //     this.logger.warn(`Пользователь ${login} уже захватил таблицу`);
  //   }
  //   return NO_FREE_HISTORY_RECORD_TABLE;
  // }
}

export default TimelineService;
