import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LOCK, Transaction } from 'sequelize';
import { ALL_USERS_SETTING_VALUE } from 'src/auth/consts';
import Settings from 'src/db/models/settings';
import { UpdateSettingsDto } from './types';
import { RECORD_SETTING_PROPERTY_NAME } from 'src/history/consts';
import { isNull, nonNull } from 'src/utils/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SettingsService } from './settings.service';

export const SYSTEM_ENGINEER_PROPERTY = 'system_engineer';

export type SystemUserSettings = {
  username: string;
  password: string;
};

@Injectable()
export class UserSettingsService extends SettingsService {
  constructor(
    protected readonly prismaService: PrismaService,
    @InjectModel(Settings) protected readonly settingsModel: typeof Settings
  ) {
    super(prismaService, settingsModel);
    // this.logger.log('Init controller');
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

  async removeRecordingSettingsByUsername(username: string): Promise<void> {
    await this.settingsModel.destroy({
      where: {
        name: RECORD_SETTING_PROPERTY_NAME,
        username,
      },
    });
  }
}


