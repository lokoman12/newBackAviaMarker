import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import AznbHistory from "src/db/models/aznbHistory.model";
import HistoryService from "./history.service";
import { Sequelize } from "sequelize";

@Injectable()
class AznbHistoryService extends HistoryService<AznbHistory> {
  protected readonly logger = new Logger(AznbHistoryService.name);

  constructor(
    @InjectConnection()
    protected readonly sequelize: Sequelize,
    @InjectModel(AznbHistory) protected readonly historyModel: typeof AznbHistory
  ) {
    super(sequelize, historyModel);
    this.logger.log('Сервис инициализирован!')
  }

}

export default AznbHistoryService;
