import { Injectable, Logger } from "@nestjs/common";
import { ALL_GROUPS_SETTING_VALUE, RECORD_SETTING_PROPERTY_NAME } from "src/auth/consts";
import { SettingsService } from "src/settings/settings.service";
import { ExternalScheduler } from "./external.scheduler";
import { getCopyHistoryName } from "./utis";
import { TimelineRecordDto } from "./timeline.record.dto";
import { UpdateSettingsDto } from "src/settings/types";

@Injectable()
export class RecordStatusService {
  private readonly logger = new Logger(RecordStatusService.name);

  constructor(
    private readonly scheduler: ExternalScheduler,
    private readonly settingsService: SettingsService
  ) {
    this.logger.log('Сервис инициализирован!')
  }

  async getRecordStatus(login: string): Promise<TimelineRecordDto | undefined> {
    const result = await this.settingsService.getTypedUserSettingValueByName<TimelineRecordDto>(
      TimelineRecordDto.fromJsonString, RECORD_SETTING_PROPERTY_NAME, login
    );
    return result;
  }

  async isInRecordStatus(login: string): Promise<boolean> {
    const recordStatus = await this.getRecordStatus(login);
    const result = recordStatus !== undefined;
    this.logger.log('----> TimelineService, isInRecordStatus', login, result);

    return result;
  }

  /**
   * Устанавливаем или сбрасываем статус записи.
   */
  public async setRecordStatus(dto: TimelineRecordDto): Promise<void> {
    const recording = this.getRecordStatus(dto.login);

    const valueToSave = {
      name: RECORD_SETTING_PROPERTY_NAME,
      username: dto.login,
      groupname: ALL_GROUPS_SETTING_VALUE,
      value: dto.asJsonString(),
    } as UpdateSettingsDto;

    await this.settingsService.updateSettingValueByPropertyNameAndUsername(valueToSave);
  }

  /**
   * 
   * @returns Сбрасываем статус записи истории TOI для пользователя.
   * Для этого удаляем сеттинг с таким именем и юзернеймом из таблицы,
   * останавливает соответствующую джобу выдачи записи истории в актуальную третичку.
   */
  async resetRecordStatus(login: string): Promise<void> {
    this.logger.log('----> TimelineService, resetRecordStatus', RECORD_SETTING_PROPERTY_NAME, login);
    const record = await this.getRecordStatus(login);
    if (record) {
      const taskName = getCopyHistoryName(record.tableNumber);
      this.scheduler.cancelJobByName(taskName);
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