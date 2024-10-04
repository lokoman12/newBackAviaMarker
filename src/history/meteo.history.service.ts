import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import MeteoHistory from "src/db/models/meteoHistory.model";
import HistoryService from "./history.service";
import { Sequelize } from "sequelize";

@Injectable()
class MeteoHistoryService extends HistoryService<MeteoHistory> {
  protected readonly logger = new Logger(MeteoHistoryService.name);

  constructor(
    @InjectConnection()
    protected readonly sequelize: Sequelize,
    @InjectModel(MeteoHistory) protected readonly historyModel: typeof MeteoHistory
  ) {
    super(sequelize, historyModel);
    this.logger.log('Сервис инициализирован!')
  }

}

export default MeteoHistoryService;
