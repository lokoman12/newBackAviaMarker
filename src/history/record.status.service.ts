import { Injectable, Logger } from "@nestjs/common";
import { ALL_GROUPS_SETTING_VALUE, NO_FREE_HISTORY_RECORD_TABLE, RECORD_SETTING_PROPERTY_NAME } from "src/auth/consts";
import { SettingsService } from "src/settings/settings.service";
import { ExternalScheduler } from "./external.scheduler";
import { getCopyHistoryName } from "./utis";
import { TimelineRecordDto } from "./timeline.record.dto";
import { UpdateSettingsDto } from "src/settings/types";
import { ApiConfigService } from "src/config/api.config.service";
import { difference, head } from 'lodash';
import HistoryService from "./historyService";

@Injectable()
export class RecordStatusService {
  private readonly logger = new Logger(RecordStatusService.name);

  constructor(
    private readonly scheduler: ExternalScheduler,
    private readonly settingsService: SettingsService,
    private readonly configDataService: ApiConfigService,
    private readonly historyService: HistoryService
  ) {
    this.logger.log('Сервис инициализирован!')
  }

  async getRecordStatus(login: string): Promise<TimelineRecordDto | null> {
    const result = await this.settingsService.getTypedUserSettingValueByName<TimelineRecordDto>(
      TimelineRecordDto.fromJsonString, RECORD_SETTING_PROPERTY_NAME, login
    );
    return result;
  }

  async isInRecordStatus(login: string): Promise<boolean> {
    const recordStatus = await this.getRecordStatus(login);
    const result = recordStatus != null;

    return result;
  }

  /**
   * Устанавливаем или сбрасываем статус записи.
   */
  public async setRecordStatus(dto: TimelineRecordDto): Promise<void> {
    const isRecording = await this.isInRecordStatus(dto.login);
    // Только, если ещё не в статусе записи
    // if (!isRecording) {
      const valueToSave = {
        name: RECORD_SETTING_PROPERTY_NAME,
        username: dto.login,
        groupname: ALL_GROUPS_SETTING_VALUE,
        value: dto.asJsonString(),
      } as UpdateSettingsDto;

      await this.settingsService.updateSettingValueByPropertyNameAndUsername(valueToSave);
    // }
  }

  async tryFillInUserHistoryTable(login: string, startTime: Date, endTime: Date, velocity: number): Promise<number> {
    // Проверяем, вдруг юзер уже получает историю, а значит - за ним закреплена таблица
    const inRecordStatus = await this.isInRecordStatus(login);

    // Пробуем найти и выделить свободную таблицу
    // if (!inRecordStatus) {
      // Использованные номера таблиц
      let usedTableNumbers = await this.settingsService
        .getAllSettingsByName(RECORD_SETTING_PROPERTY_NAME);
      usedTableNumbers = usedTableNumbers
        .map(it => parseInt(it.value))
        .filter(it => !isNaN(it)) as Array<number>;
      // Все имеющиеся номера
      const allTableNumbers = Array.from(
        { length: this.configDataService.getHistoryRecordTablesNumber() },
        (_, index) => index
      ) as Array<number>;
      // Свободные
      const freeTableNumbers = difference(allTableNumbers, usedTableNumbers)
        .sort((x, y) => x - y);

      // Ищём свободный номер таблицы
      if (freeTableNumbers.length > 0) {
        const nextFreeTableNumber = head(freeTableNumbers);
        this.logger.log(`nextFreeTableNumber: ${nextFreeTableNumber}`);
        try {
          await this.historyService.prepareHistoryForRecordTable(nextFreeTableNumber, startTime, endTime);
          const dto = new TimelineRecordDto(login, startTime, endTime, startTime, velocity, nextFreeTableNumber);
          await this.setRecordStatus(dto);
          // const taskName = getCopyHistoryName(nextFreeTableNumber);
          // this.scheduler.addJob(
          //   taskName,
          //   this.configDataService.getToiCopyToHistoryCronMask(),
          //   async () => {
          //     await this.actualAirNavDataService.copyHistoryToActualDataForRecordingUser(login);
          //   }
          // );
        } catch (e) {
          this.logger.error('Не смогли захватить следующую свободную таблицу истории', e);
          return NO_FREE_HISTORY_RECORD_TABLE;
        }

        this.logger.log(`Следующий свободный номер таблицы истории: ${nextFreeTableNumber}`);
        return nextFreeTableNumber;
      }
    // } else {
    //   this.logger.warn(`Пользователь ${login} уже захватил таблицу`);
    // }
    return NO_FREE_HISTORY_RECORD_TABLE;
  }

  /**
   * 
   * @returns Сбрасываем статус записи истории TOI для пользователя.
   * Для этого удаляем сеттинг с таким именем и юзернеймом из таблицы,
   * останавливает соответствующую джобу выдачи записи истории в актуальную третичку.
   */
  async resetRecordStatus(login: string): Promise<void> {
    this.logger.log(`----> TimelineService, resetRecordStatus: ${RECORD_SETTING_PROPERTY_NAME}, ${login}`);
    const record = await this.getRecordStatus(login);
    if (record) {
      const taskName = getCopyHistoryName(record.tableNumber);
      // this.scheduler.cancelJobByName(taskName);
      await this.settingsService.removeRecordingSettingsByUsername(login);
    } else {
      this.logger.warn(`Таблица записи для пользователя ${login} не существует, удалить невозможно`)
    }
  }

  async getRecordStatuses(): Promise<Array<TimelineRecordDto>> {
    const result = await this.settingsService.getTypedSettingsByName<TimelineRecordDto>(
      TimelineRecordDto.fromJsonString, RECORD_SETTING_PROPERTY_NAME
    );
    return result;
  }
}