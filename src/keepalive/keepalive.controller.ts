import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

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
    private readonly prismaService: PrismaService
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  @Get()
  async getHealth(): Promise<ServerHealthType> {
    let status: HealthStatusEnum = HealthStatusEnum.ALL_OK;

    try {
      await this.prismaService.$executeRaw`
        select id from toi limit 1
      `;
    } catch (e) {
      status = HealthStatusEnum.DATABASE_PROBLEM;
    }
    return {
      status,
    };
  }
}
