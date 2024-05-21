import { Injectable, Logger } from "@nestjs/common";
import { IHistoryClient } from "./historyService";

export const SQL_DATE_TIME_FORMAT = '%Y-%m-%dT%H:%i:%s';

@Injectable()
class TimelineService {
  private readonly logger = new Logger(TimelineService.name);

  constructor(
  ) {
    this.logger.log('Сервис инициализирован!')
  }

}

export default TimelineService;
