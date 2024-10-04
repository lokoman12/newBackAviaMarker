import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import OmnicomHistory from "src/db/models/scoutHistory.model";
import HistoryService from "./history.service";
import { Sequelize } from "sequelize";

@Injectable()
class OmnicomHistoryService extends HistoryService<OmnicomHistory> {
  protected readonly logger = new Logger(OmnicomHistoryService.name);

  constructor(
    @InjectConnection()
    protected readonly sequelize: Sequelize,
    @InjectModel(OmnicomHistory) protected readonly historyModel: typeof OmnicomHistory
  ) {
    super(sequelize, historyModel);
    this.logger.log('Сервис инициализирован!')
  }

}

export default OmnicomHistoryService;
