import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import StandsHistory from "src/db/models/standsHistory.model";
import HistoryService from "./history.service";
import { Sequelize } from "sequelize";

@Injectable()
class StandsHistoryService extends HistoryService<StandsHistory> {
  protected readonly logger = new Logger(StandsHistoryService.name);

  constructor(
    @InjectConnection()
    protected readonly sequelize: Sequelize,
    @InjectModel(StandsHistory) protected readonly historyModel: typeof StandsHistory
  ) {
    super(sequelize, historyModel)
    // this.logger.log('Сервис инициализирован!');
  }

}

export default StandsHistoryService;
