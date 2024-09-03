import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { IToi } from 'src/db/models/toi.model';
import { IFormular } from 'src/db/models/Formular.model';
import { ApiConfigService } from 'src/config/api.config.service';
import SCOUT from 'src/db/models/scout.model';

export interface ActualToi {
  toi: IToi;
  formular: IFormular;
}

export type ActualClientToi = Partial<IToi> & {
  formular: Array<IFormular>
}

@Injectable()
export default class OmnicomService {
  private readonly log = new Logger(OmnicomService.name);

  constructor(
    @InjectModel(SCOUT) private readonly omnicomModel: typeof SCOUT,
  ) {
    this.log.log('Init service');
  }

  async getActualOmnicom(): Promise<Array<SCOUT>> {
    try {
      const omnicom = await this.omnicomModel.findAll();
      return omnicom;
    } catch (error) {
      console.error('Error retrieving alarm:', error);
      throw error;
    }
  }

}
