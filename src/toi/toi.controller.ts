import { Controller, Get, Req } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request } from 'express';
import ToiService from './toi.service';
import { ExtractJwt } from 'passport-jwt';
import { decode } from 'jsonwebtoken';

@Controller('toi')
export class ToiController {
  private readonly log = new Logger(ToiController.name);

  constructor(
    private toiService: ToiService
    // , private jwtService: JwtService
  ) {
    this.log.log('Init controller');
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
    const formattedToi = this.toiService.getActualClientToi();
    return formattedToi;
  }
}
