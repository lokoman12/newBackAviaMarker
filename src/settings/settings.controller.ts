import {
  Controller,
  Get,
  Logger,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { SettingsService } from './settings.service';
import { CreateSettingsDto, UpdateSettingsDto } from './types';

@Controller('settings')
export class SettingsController {
  private readonly log = new Logger(SettingsController.name);

  constructor(
    private settingsService: SettingsService,
  ) { }

  @Public()
  @Post('/')
  async addNewSetting(@Body() dto: CreateSettingsDto) {
    const setting = await this.settingsService.createSetting(dto);
    return setting;
  }

  @Public()
  @Get('/')
  async getAllSettings() {
    const settings = await this.settingsService.getAllSettings();
    return settings;
  }

  @Public()
  @Get('/:id')
  async getSettingById(@Param('id') id: number) {
    const setting = await this.settingsService.getSetting(id);
    if (setting === null) {
      throw new NotFoundException(`Свойство с id: ${id} не найдено`);
    }
    return setting;
  }

  @Public()
  @Get('/:name/by-name')
  async getSettingsByName(@Param('name') name: string) {
    const setting = await this.settingsService.getAllSettingsByName(name);
    return setting;
  }

  @Public()
  @Get('/:login/by-user')
  async getSettingsByUser(@Param('login') login: string) {
    const setting = await this.settingsService.getAllUserSettings(login);
    return setting;
  }

  @Public()
  @Put('/:id')
  async updateSetting(@Param('id') id: number, dto: UpdateSettingsDto) {
    const setting = await this.settingsService.updateSetting(id, dto);
    return setting;
  }

  @Public()
  @Delete('/:id')
  async removeGroupById(@Param('id') id: number) {
    const setting = await this.settingsService.removeSetting(id);
    return setting;
  }

}
