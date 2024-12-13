import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Settings from 'src/db/models/settings';
import { ApiConfigModule } from 'src/config/config.module';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ApiConfigModule, PrismaModule, SequelizeModule.forFeature([Settings]),],
  providers: [SettingsService,],
  controllers: [SettingsController,],
  exports: [SettingsService,],
})
export class SettingsModule { }