import { Controller, Get, Req } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request } from 'express';
import ToiService from './toi.service';

export const saveStringifyBigInt = (data: any) => JSON.parse(
  JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  ),
);

@Controller('/toi')
export class ToiController {
  private readonly logger = new Logger(ToiController.name);

  constructor(
    private toiService: ToiService
  ) {
    // this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllToi(@Req() req: Request): Promise<Array<any>> {
    // const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerTokenconst();
    // const jwtExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
    // const jwtToken = jwtExtractor(req)
    // const value = decode(jwtToken);
    // if (jwtToken?.length > 0) {
    //   this.log.log(`----> getAllToi: ${jwtToken}, ${JSON.stringify(value)}`);
    // }
    const formattedToi = await this.toiService.getActualData();
    return saveStringifyBigInt(formattedToi);
  }

  @Public()
  @Get('test')
  async getToiForTest(@Req() _: Request): Promise<Array<any>> {
    const formattedToi = await this.toiService.getActualData();
    return formattedToi;
  }
}
