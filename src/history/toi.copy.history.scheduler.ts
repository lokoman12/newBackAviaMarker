import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "src/config/api.config.service";
import { ExternalScheduler } from "./external.scheduler";
import ToiService from "src/toi/toi.service";
import ToiHistory from "src/db/models/toiHistory.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export default class ToiCopyToHistoryScheduler {
  private readonly logger = new Logger(ToiCopyToHistoryScheduler.name);

  public static toiCopyToHistoryJobName = 'ToiCopyToHistory';

  constructor(
    private configService: ApiConfigService,
    private externalScheduler: ExternalScheduler,
    private toiService: ToiService,
    @InjectModel(ToiHistory) private readonly toiHistoryModel: typeof ToiHistory
  ) {
    this.logger.log('Сервис инициализирован!')

    // this.externalScheduler.addJob(
    //   ToiCopyToHistoryScheduler.toiCopyToHistoryJobName,
    //   this.configService.getToiCopyToHistoryCronMask(),
    //   this.toiCopyToHistory
    // );
  }

  public async toiCopyToHistory() {
    const toiListForHistory = await this.toiService.getActualToi();
    const promises = [];
    
    this.logger.log(`Try to insert, ${toiListForHistory.length} rocords`);
    
    toiListForHistory.forEach(it => {
      const time = Date.now();
      const data = {
        id_Sintez: it.toi.id_Sintez,
        X: it.toi.X,
        Y: it.toi.Y,
        H: it.toi.H,
        Number: it.toi.Number,
        CRS: it.toi.CRS,
        Name: it.toi.Name,
        faza: it.toi.faza,
        time,
        FP_Callsign: it.formular.FP_Callsign,
        FP_Stand: it.formular.FP_stand,
        FP_TypeAirCraft: it.formular.FP_TypeAirCraft,
        Source_ID: it.formular.Source_ID,
        Speed: it.formular.Speed,
        Type_of_Msg: it.formular.Type_of_Msg,
        airport_code: it.formular.airport_code,
        ata: it.formular.ata,
        regnum: it.formular.regnum,
        taxi_out: it.formular.taxi_out,
        tobtg: it.formular.tobtg,
        tow: it.formular.tow,
      }
      promises.push(this.toiHistoryModel.create(data));
    });
    await Promise.all(promises);
  }

}
