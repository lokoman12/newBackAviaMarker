import { Injectable, Logger } from "@nestjs/common";
import { ALL_GROUPS_SETTING_VALUE } from "src/auth/consts";
import { SettingsService } from "src/settings/settings.service";
import { TimelineRecordDto } from "./timeline.record.dto";
import { CreateSettingsDto, UpdateSettingsDto } from "src/settings/types";
import { RECORD_SETTING_PROPERTY_NAME, RECORD_TABLENUMBER_SETTING_PROPERTY_NAME } from "../history/consts";
import { HistoryGenerateStagesType, NextCurrentTypeForResponse } from "./types";
import { HistoryErrorCodeEnum, HistoryBadStateException } from "./user.bad.status.exception";
import { cloneDeep } from 'lodash';
import { isNormalNumber, isPositiveNormalNumber } from "src/utils/number";
import { Transaction } from "sequelize";
import dayjs from "../utils/dayjs";

@Injectable()
export class RecordStatusService {
  private readonly logger = new Logger(RecordStatusService.name);

  constructor(
    private readonly settingsService: SettingsService,
  ) {
    // this.logger.log('Сервис инициализирован!')
  }

  async getUserTablenumber(username: string): Promise<number> {
    const result = await this.settingsService.getUserSettingValueByName(
      RECORD_TABLENUMBER_SETTING_PROPERTY_NAME, username, "-1");
    return parseInt(result);
  }

  async hasUserTablenumber(username: string): Promise<boolean> {
    try {
      const recordStatus = await this.getUserTablenumber(username);
      return recordStatus > -1;
    } catch (e) {
      return false;
    }
  }

  public async setTablenumber(username: string, tablenumber: number): Promise<void> {
    // const isRecording = await this.isInRecordStatus(dto.login);
    // Сохраняем, если ещё не в статусе записи
    // if (!isRecording) {
    const valueToSave = {
      name: RECORD_TABLENUMBER_SETTING_PROPERTY_NAME,
      username,
      groupname: ALL_GROUPS_SETTING_VALUE,
      value: JSON.stringify(tablenumber),
    } as CreateSettingsDto;
    this.logger.log(JSON.stringify(valueToSave));
    await this.settingsService.createSetting(valueToSave);
  }

  public async resetTablenumber(username: string): Promise<void> {
    const hasTablenumber = await this.hasUserTablenumber(username);
    // Сохраняем, если ещё не в статусе записи
    if (hasTablenumber) {
      await this.settingsService.removeSettingByName(RECORD_TABLENUMBER_SETTING_PROPERTY_NAME, username);
    }
  }

  async resetUserHistoryStatusOnException(login: string) {
    this.logger.warn(`Не получилось включить воспроизведение записи пользователем ${login}. Сбрасываем статус. Нет смысла продолжать`);
    await this.resetRecordStatus(login);
  }

  async getRecordStatus(login: string, tx?: Transaction): Promise<TimelineRecordDto | null> {
    // tx && this.logger.log(`getRecordStatus within transaction`);

    const result = await this.settingsService.getTypedUserSettingValueByName<TimelineRecordDto>(
      TimelineRecordDto.fromJsonString, RECORD_SETTING_PROPERTY_NAME, login, undefined, tx
    );
    return result;
  }

  private isHistoryStagesDone(historyStages: HistoryGenerateStagesType): boolean {
    return Object.keys(historyStages)?.length === 5
      && Object.entries(historyStages).every((entry) => entry[1] === HistoryErrorCodeEnum.noErrors);
  }

  private isHistoryStagesProceeded(historyStages: HistoryGenerateStagesType): boolean {
    return Object.keys(historyStages)?.length === 5
      && Object.entries(historyStages).every((entry) => isPositiveNormalNumber(entry[1]));
  }

  async isInHistoryGenerateStatus(login: string): Promise<boolean> {
    try {
      const recordStatus = await this.getRecordStatus(login);
      return !this.isHistoryStagesProceeded(recordStatus?.historyGenerateStages);
    } catch (e) {
      return false;
    }
  }

  async isInRecordStatus(login: string): Promise<boolean> {
    try {
      const recordStatus = await this.getRecordStatus(login);
      return this.isHistoryStagesDone(recordStatus?.historyGenerateStages)
        && isNormalNumber(recordStatus?.startToiId) && isNormalNumber(recordStatus?.currentToiId)
        && isNormalNumber(recordStatus?.endToiId);
    } catch (e) {
      return false;
    }
  }

  /**
   * Устанавливаем или сбрасываем статус записи.
   */
  public async setRecordStatus(dto: TimelineRecordDto, tx?: Transaction): Promise<void> {
    // const isRecording = await this.isInRecordStatus(dto.login);
    // Сохраняем, если ещё не в статусе записи
    // if (!isRecording) {
    const value = dto.asJsonString();
    const valueToSave = {
      name: RECORD_SETTING_PROPERTY_NAME,
      username: dto.login,
      groupname: ALL_GROUPS_SETTING_VALUE,
      value,
    } as UpdateSettingsDto;
    await this.settingsService.updateSettingValueByPropertyNameAndUsername(valueToSave, tx);
  }

  /**
 * Обновляем состояние записи, устанавливая новые текущий шаг и время.
 */
  public async setNextCurrentPropertiesRecordStatus(login: string, nextCurrentStep: number, nextCurrentTime: Date): Promise<NextCurrentTypeForResponse> {
    // Получим текущий статус
    const currentStatus = await this.getRecordStatus(login);
    if (!currentStatus) {
      const message = `Перед обновлёнием статуса он не должен быть пустым`;
      this.logger.error(message);
      await this.resetUserHistoryStatusOnException(login);
      throw new HistoryBadStateException(login, HistoryErrorCodeEnum.userStatusNotFound, message);
    }
    if (!dayjs.utc(nextCurrentTime).isValid()) {
      const message = `Следующая дата воспроизведения записи должна иметь корректное значение: ${nextCurrentTime}`;
      this.logger.error(message);
      await this.resetUserHistoryStatusOnException(login);
      throw new HistoryBadStateException(login, HistoryErrorCodeEnum.invalidDateValue, message);
    }

    // Обновим текущие шаг и время
    currentStatus.setNextCurrent({
      nextCurrentTime: nextCurrentTime,
      nextCurrentStep: nextCurrentStep,
    });
    await this.setRecordStatus(currentStatus);

    const nextCurrent: NextCurrentTypeForResponse = { nextCurrentTime: nextCurrentTime.getTime(), nextCurrentStep };
    return nextCurrent;
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
      try {
        await this.settingsService.removeRecordingSettingsByUsername(login);
      } catch (e) {
        this.logger.warn(`Не получилось сбросить настройки для пользователя ${login}, ошибка ${e}. Работаем дальше`)
      }
    } else {
      this.logger.warn(`Пользователь ${login} не находится в состоянии воспроизведения истории`)
    }
  }

  async getRecordStatuses(): Promise<Array<TimelineRecordDto>> {
    const result = await this.settingsService.getTypedSettingsByName<TimelineRecordDto>(
      TimelineRecordDto.fromJsonString, RECORD_SETTING_PROPERTY_NAME
    );
    return result;
  }

  async setCurrent(
    login: string,
    currentToiId: number,
    currentTime: Date): Promise<any> {
    let record = await this.getRecordStatus(login);

    if (record) {
      const newTimelineDto = cloneDeep(record);
      newTimelineDto.setNextCurrent({ nextCurrentTime: currentTime, nextCurrentStep: currentToiId });

      const valueToSave = {
        name: RECORD_SETTING_PROPERTY_NAME,
        username: record.login,
        groupname: ALL_GROUPS_SETTING_VALUE,
        value: newTimelineDto.asJsonString(),
      } as UpdateSettingsDto;

      this.logger.log(`setCurrent, dto: ${JSON.stringify(newTimelineDto)}`);
      await this.settingsService.updateSettingValueByPropertyNameAndUsername(valueToSave);

      record = await this.getRecordStatus(login);
      return record;
    }

    this.logger.warn(`Таблица записи для пользователя ${login} не существует, невозможно установить текущий момент`);
    return null;
  }
}