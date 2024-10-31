import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Settings from 'src/db/models/settings';
import { ApiConfigModule } from 'src/config/config.module';
import User from 'src/db/models/user';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';

@Module({
  providers: [SettingsService,],
  imports: [ApiConfigModule, SequelizeModule.forFeature([User, Settings]),], controllers: [SettingsController,],
  exports: [SettingsService,],
})
export class SettingsModule { }