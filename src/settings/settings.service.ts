import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LOCK, Op, Transaction } from 'sequelize';
import { ALL_USERS_SETTING_VALUE } from 'src/auth/consts';
import Settings from 'src/db/models/settings';
import { CreateSettingsDto, UpdateSettingsDto } from './types';
import { AZNB_HISTORY_TABLE_NAME, HISTORY_TEMPLATE_TOKEN, METEO_HISTORY_TABLE_NAME, OMNICOM_HISTORY_TABLE_NAME, RECORD_SETTING_PROPERTY_NAME, STANDS_HISTORY_TABLE_NAME, TOI_HISTORY_TABLE_NAME } from 'src/history/consts';
import { isNull, nonNull } from 'src/utils/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { setting } from '@prisma/client';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  // --- Имя нумерованной таблицы с записями из соответствующей истории
  private static getHistoryRecordTableName = (historyTableName: string) => {
    return `${historyTableName}${HISTORY_TEMPLATE_TOKEN}`;
  }

  public static getRecordTableNameByIndex(tableName: string, tableNumber: number) {
    return `${this.getHistoryRecordTableName(tableName)}_${tableNumber}`;
  }

  public static getRecordStandsTableNameByIndex(tableNumber: number) {
    return `${this.getHistoryRecordTableName(STANDS_HISTORY_TABLE_NAME)}_${tableNumber}`;
  }

  public static getRecordAznbTableNameByIndex(tableNumber: number) {
    return `${this.getHistoryRecordTableName(AZNB_HISTORY_TABLE_NAME)}_${tableNumber}`;
  }

  constructor(
    private readonly prismaService: PrismaService,
    @InjectModel(Settings) private readonly settingsModel: typeof Settings
  ) {
    this.logger.log('Init controller');
  }

  async getSetting(id: number): Promise<setting | null> {
    return await this.prismaService.setting.findFirst({
      where: { id, },
    });
  }

  async getAllSettings(): Promise<Array<setting>> {
    return await this.prismaService.setting.findMany();
  }

  async getAllUserSettings(login: string): Promise<Array<any>> {
    const resultByLogin = await this.prismaService.setting.findMany({
      where: {
        username: {
          in: [login, ALL_USERS_SETTING_VALUE,],
        },
      },
      select: { name: true, value: true, },
    });

    return resultByLogin;
  }

  async getRecordSettingByUser(login: string): Promise<any> {
    const resultByLogin = await this.prismaService.setting.findFirst({
      where: {
        username: {
          in: [login,],
        },
        name: RECORD_SETTING_PROPERTY_NAME,
      },
      select: { id: true, name: true, value: true, },
    });

    return resultByLogin;
  }

  async getAllSettingsByName(name: string): Promise<Array<any>> {
    const result = await this.prismaService.setting.findMany({
      where: { name, },
      select: { name: true, username: true, value: true, },
    });
    return result || [];
  }

  async getUserSettingValueByName(name: string, username: string, defaultValue?: string, tx?: Transaction): Promise<string | null> {
    const lock = tx ? { lock: LOCK.UPDATE, } : {};
    const result = await this.settingsModel.findOne({
      where: {
        name, username,
      },
      attributes: ['value'],
      ...lock,
      transaction: tx || null,
    });

    // Возвращаем значение по умолчанию, когда не нашли свойство в базе
    if (isNull(result) && nonNull(defaultValue)) {
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
  async getTypedUserSettingValueByName<T>(mapFunction: (value: string) => T, name: string, username: string, defaultValue?: string, tx?: Transaction): Promise<T | null> {
    // tx && this.logger.log(`getTypedUserSettingValueByName within transaction`);
    const strResult = await this.getUserSettingValueByName(name, username, defaultValue, tx);
    return nonNull(strResult) ? mapFunction(strResult) : null;
  }

  async getTypedSettingsByName<T>(mapFunction: (value: string) => T, name: string): Promise<Array<T> | null> {
    const result = await this.settingsModel.findAll({
      where: {
        name
      },
      attributes: ['value',],
    });
    this.logger.log(`getTypedSettingsByName: ${result}`);
    return nonNull(result) ? result.map(it => mapFunction(it.value)).filter(nonNull) : null;
  }

  async createSetting(dto: CreateSettingsDto): Promise<void> {
    await this.settingsModel.create({ ...dto, });
  }

  async updateSetting(id: number, dto: UpdateSettingsDto): Promise<void> {
    await this.settingsModel.update(
      { dto, },
      {
        where: { id, },
      }
    );
  }

  async updateSettingValueByPropertyNameAndUsername(dto: UpdateSettingsDto, tx?: Transaction): Promise<void> {
    // this.logger.log(`setRecordStatus ${dto.name}, ${dto.username}`);

    const item = {
      name: dto.name,
      username: dto.username,
      groupname: dto.groupname,
      value: dto.value,
    };
    const where = {
      name: dto.name,
      username: dto.username,
    };
    const model = await this.settingsModel.findOne({ raw: true, where, transaction: tx || null });
    if (model) {
      await this.settingsModel.update(item, { where, transaction: tx || null });
    } else {
      await this.settingsModel.create(item, { transaction: tx || null });
    }
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
        name: RECORD_SETTING_PROPERTY_NAME,
        username,
      },
    });
  }
}


