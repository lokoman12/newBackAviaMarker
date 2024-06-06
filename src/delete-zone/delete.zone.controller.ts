import { Controller, Delete, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import ZoneAM from 'src/db/models/zone.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('deleteZone')
export class DeleteZoneController {
  private readonly log = new Logger(DeleteZoneController.name);

  constructor(
    @InjectModel(ZoneAM) private readonly zoneModel: typeof ZoneAM,
  ) {
    this.log.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteZone(@Param('id') id: number): Promise<void> {
    try {
      const zoneToDelete = await this.zoneModel.findByPk(id);
      if (!zoneToDelete) {
        throw new Error('Zone not found');
      }
      await zoneToDelete.destroy();
    } catch (error) {
      this.log.error('Error deleting zone:', error);
      throw error;
    }
  }
}
