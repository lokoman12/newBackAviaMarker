import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ALL_USERS_SETTING_VALUE, EMPTY_OBJECT, RECORD_SETTING_PROPERTY_NAME, TOI_ACTUAL_TEMPLATE_NAME, TOI_HISTORY_RECORD_TEMPLATE_NAME } from 'src/auth/consts';
import Settings from 'src/db/models/settings';
import { CreateSettingsDto, UpdateSettingsDto } from './types';


@Injectable()
export class SettingsService {
  private readonly log = new Logger(SettingsService.name);

  public static getRecordHistoryTableNameByIndex(tableNumber: number) {
    return `${TOI_HISTORY_RECORD_TEMPLATE_NAME}${tableNumber}`;
  }

  public static getToiActualTableNameByIndex(tableNumber: number) {
    return `${TOI_ACTUAL_TEMPLATE_NAME}${tableNumber}`;
  }

  constructor(
    @InjectModel(Settings) private readonly settingsModel: typeof Settings
  ) {
    this.log.log('Init controller');
  }

  async getSetting(id: number): Promise<Settings | null> {
    return await this.settingsModel.findOne(
      {
        where: { id, },
      }
    );
  }

  async getAllSettings(): Promise<Array<Settings>> {
    return await this.settingsModel.findAll(EMPTY_OBJECT);
  }

  async getAllUserSettings(login: string): Promise<Array<any>> {
    const resultByLogin = await this.settingsModel.findAll({
      where: {
        username: {
          [Op.in]: [login, ALL_USERS_SETTING_VALUE,],
        },
      },
      attributes: ['name', 'value',],
    });

    return resultByLogin;
  }

  async getAllSettingsByName(name: string): Promise<Array<any>> {
    const result = await this.settingsModel.findAll({
      where: { name, },
      attributes: ['name', 'username', 'value',],
    });
    return result || [];
  }

  async getUserSettingValueByName(name: string, username: string, defaultValue?: string): Promise<string | null> {
    const result = await this.settingsModel.findOne({
      where: {
        name, username,
      },
      attributes: ['value'],
    });

    // Возвращаем значение по умолчанию, когда не нашли свойство в базе
    if (result == null && defaultValue != null) {
      return defaultValue;
    }

    return result?.value;
  }

  /**
  * Получаем сеттинг, заданного типа. Пример:
  * const result = getTypedSetting<boolean>(boolValue, "true")
  * 
  * @param mapFunction функция преобразования строки к примитивному типу: число, булеан
  * @param name имя проперти
  * @param username имя пользователя
  * @param defaultValue значение по умолчанию, опционально
  * @returns 
  */
  async getTypedUserSettingValueByName<T>(mapFunction: (value: string) => T, name: string, username: string, defaultValue?: string): Promise<T | null> {
    const strResult = await this.getUserSettingValueByName(name, username, defaultValue);
    return strResult != null ? mapFunction(strResult) : null;
  }

  async getTypedSettingsByName<T>(mapFunction: (value: string) => T, name: string): Promise<Array<T> | null> {
    const result = await this.settingsModel.findAll({
      where: {
        name
      },
      attributes: ['value',],
    });

    return result != null ? result.map(it => mapFunction(it.value)).filter(it => it != null) : [];
  }

  async createSetting(dto: CreateSettingsDto): Promise<void> {
    await this.settingsModel.create({ dto, });
  }

  async updateSetting(id: number, dto: UpdateSettingsDto): Promise<void> {
    await this.settingsModel.update(
      { dto, },
      {
        where: { id, },
      }
    );
  }

  async updateSettingValueByPropertyNameAndUsername(dto: UpdateSettingsDto): Promise<void> {
    await this.settingsModel.update(
      { value: dto.value, },
      {
        where: {
          name: dto.name,
          username: dto.username,
        },
      }
    );
  }

  async removeSetting(id: number): Promise<void> {
    await this.settingsModel.destroy({
      where: { id, },
    });
  }

  async removeSettingByName(name: string, username: string): Promise<void> {
    await this.settingsModel.destroy({
      where: { name, username, },
    });
  }

  async removeRecordingSettingsByUsername(username: string): Promise<void> {
    await this.settingsModel.destroy({
      where: {
        name: {
          startsWith: RECORD_SETTING_PROPERTY_NAME,
        },
        username,
      },
    });
  }
}


