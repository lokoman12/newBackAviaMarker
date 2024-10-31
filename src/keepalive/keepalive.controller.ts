import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { QueryTypes, Sequelize } from 'sequelize';
import { InjectConnection } from '@nestjs/sequelize';

enum HealthStatusEnum {
  ALL_OK = 'all_ok',
  DATABASE_PROBLEM = 'database',
  WEB_SERVER_PROBLEM = 'webserver'
}

type ServerHealthType = {
  status: HealthStatusEnum;
}

@Controller('/health')
export class HealthStatusController {
  private readonly logger = new Logger(HealthStatusController.name);
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize) {
    this.logger.log('Init controller');
  }

  @Public()
  @Get()
  async getHealth(): Promise<ServerHealthType> {
    let status: HealthStatusEnum = HealthStatusEnum.ALL_OK;

    try {
      const result = await this.sequelize.query(
        `select id from toi limit 1`,
        { raw: true, type: QueryTypes.SELECT, }
      )
    } catch (e) {
      status = HealthStatusEnum.DATABASE_PROBLEM;
    }
    return {
      status,
    };
  }
}
