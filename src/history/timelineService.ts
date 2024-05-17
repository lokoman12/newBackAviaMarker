import { Injectable, Logger } from "@nestjs/common";
import { IHistoryClient } from "./historyService";

@Injectable()
class TimelineService {
  private readonly logger = new Logger(TimelineService.name);

  public static DATE_TIME_FORMAT = '%Y-%m-%dT%H:%i:%s';
  
  constructor(
  ) {
    this.logger.log('Сервис инициализирован!')
  }

}

export default TimelineService;
