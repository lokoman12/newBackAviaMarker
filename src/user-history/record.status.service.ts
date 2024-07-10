import { Injectable, Logger, NotAcceptableException } from "@nestjs/common";
import { ALL_GROUPS_SETTING_VALUE } from "src/auth/consts";
import { SettingsService } from "src/settings/settings.service";
import { TimelineRecordDto } from "./timeline.record.dto";
import { UpdateSettingsDto } from "src/settings/types";
import { RECORD_SETTING_PROPERTY_NAME } from "../history/consts";
import dayjs from "../utils/dayjs";

export interface TimelineStartRecordRequest {
  timeStart: number,
  timeEnd: number,
  velocity: number
}

export interface TimelineStartRecordResponse {
  allRecs: number,
  startId: number,
  endId: number
}

@Injectable()
export class RecordStatusService {
  private readonly logger = new Logger(RecordStatusService.name);

  constructor(
    private readonly settingsService: SettingsService,
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
    return recordStatus != null;
  }

  /**
   * Устанавливаем или сбрасываем статус записи.
   */
  public async setRecordStatus(dto: TimelineRecordDto): Promise<void> {
    const isRecording = await this.isInRecordStatus(dto.login);
    this.logger.log(`isRecording: ${isRecording}`);
    // Сохраняем, если ещё не в статусе записи
    // if (!isRecording) {
    const valueToSave = {
      name: RECORD_SETTING_PROPERTY_NAME,
      username: dto.login,
      groupname: ALL_GROUPS_SETTING_VALUE,
      value: dto.asJsonString(),
    } as UpdateSettingsDto;

    await this.settingsService.updateSettingValueByPropertyNameAndUsername(valueToSave);
    // } else {
    // }
  }

  /**
 * Обновляем состояние записи, устанавливая новые текущий шаг и время.
 */
  public async setNextCurrentPropertiesRecordStatus(login: string, nextCurrentStep: number, nextCurrentTime: Date): Promise<void> {
    // Получим текущий статус
    const currentStatus = await this.getRecordStatus(login);
    if (!currentStatus) {
      const message = `Перед обновлённом статуса пользователя ${login} статус не должен быть пустым`;
      this.logger.error(message);
      throw new NotAcceptableException(message);
    }
    if (!dayjs.utc(nextCurrentTime).isValid()) {
      const message = `Next current time must have valid datatime value ${nextCurrentTime}`;
      this.logger.error(message);
      throw new NotAcceptableException(message);
    }
    // Обновим текущие шаг и время
    const nextStatus = new TimelineRecordDto(
      currentStatus.login,
      currentStatus.startTime, currentStatus.endTime, nextCurrentTime,
      currentStatus.startId, currentStatus.endId, nextCurrentStep,
      currentStatus.velocity, currentStatus.tableNumber);
    this.logger.log(`nextStatus: ${nextStatus.asJsonString()}`);
    await this.setRecordStatus(nextStatus);
  }

  /**
   * 
   * @returns Сбрасываем статус записи истории TOI для пользователя.
   * Для этого удаляем сеттинг с таким именем и юзернеймом из таблицы,
   * останавливает соответствующую джобу выдачи записи истории в актуальную третичку.
   */
  async resetRecordStatus(login: string): Promise<void> {
    const record = await this.getRecordStatus(login);
    if (record) {
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

  async updateCurrentStepAndTime(login: string, currentId: number): Promise<any> {
    const record = await this.getRecordStatus(login);
    if (record) {
      const newTimelineDto = new TimelineRecordDto(
        record.login,
        record.startTime, record.endTime, record.currentTime,
        record.startId, record.endId, currentId,
        record.velocity, record.tableNumber);

      const valueToSave = {
        name: RECORD_SETTING_PROPERTY_NAME,
        username: record.login,
        groupname: ALL_GROUPS_SETTING_VALUE,
        value: newTimelineDto.asJsonString(),
      } as UpdateSettingsDto;

      await this.settingsService.updateSettingValueByPropertyNameAndUsername(valueToSave);

    } else {
      this.logger.warn(`Таблица записи для пользователя ${login} не существует, удалить невозможно`)
    }
  }
}