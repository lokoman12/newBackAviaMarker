import { Injectable, Logger, NotAcceptableException } from "@nestjs/common";
import { ALL_GROUPS_SETTING_VALUE } from "src/auth/consts";
import { SettingsService } from "src/settings/settings.service";
import { getCopyHistoryName } from "./utis";
import { TimelineRecordDto } from "./timeline.record.dto";
import { UpdateSettingsDto } from "src/settings/types";
import { RECORD_SETTING_PROPERTY_NAME } from "./consts";
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
    const result = recordStatus != null;

    return result;
  }

  /**
   * Устанавливаем или сбрасываем статус записи.
   */
  public async setRecordStatus(dto: TimelineRecordDto): Promise<void> {
    const isRecording = await this.isInRecordStatus(dto.login);
    // Сохраняем, если ещё не в статусе записи
    if (!isRecording) {
      const valueToSave = {
        name: RECORD_SETTING_PROPERTY_NAME,
        username: dto.login,
        groupname: ALL_GROUPS_SETTING_VALUE,
        value: dto.asJsonString(),
      } as UpdateSettingsDto;

      await this.settingsService.updateSettingValueByPropertyNameAndUsername(valueToSave);
    } else {

    }
  }

  /**
 * Обновляем состояние записи, устанавливая новые текущий шаг и время.
 */
  public async setNextCurrentPropertiesRecordStatus(login: string, nextCurrentStep: number, nextCurrentTime: Date): Promise<void> {
    // Получим текущий статус
    const currentStatus = await this.getRecordStatus(login);
    if (!currentStatus) {
      this.logger.error(`Can not get status for user with login ${login}`);
      throw new NotAcceptableException(`Can not get status for user with login ${login}`);
    }
    if (!dayjs.utc(nextCurrentTime).isValid()) {
      this.logger.error(`Next current time must have valid datatime value ${nextCurrentTime}`);
      throw new NotAcceptableException(`Next current time must have valid datatime value ${nextCurrentTime}`);
    }
    // Обновим текущие шаг и время
    const nextStatus = new TimelineRecordDto(
      currentStatus.login,
      currentStatus.startTime, currentStatus.endTime, nextCurrentTime,
      currentStatus.endId, currentStatus.startId, nextCurrentStep,
      currentStatus.velocity, currentStatus.tableNumber);
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
}