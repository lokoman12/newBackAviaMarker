import { BadRequestException, Injectable, Logger, PipeTransform } from "@nestjs/common";
import dayjs from '../utils/dayjs';
import { DATE_TIME_FORMAT } from "src/consts/time";

@Injectable()
export class ParseDatePipe implements PipeTransform<string | Date | undefined | null> {
  private readonly logger = new Logger(ParseDatePipe.name);
  
  constructor(private readonly required: boolean = true) { }

  transform(value: string | Date | undefined | null | (() => string | Date) | undefined | null): Date {
    if (!this.required && !value) {
      return value as undefined | null;
    }

    if (!value) {
      throw new BadRequestException('Date is required');
    }

    if (typeof value === 'function') {
      value = value();
    }
    const transformedValue = dayjs.utc(value, DATE_TIME_FORMAT);
    this.logger.log(`transformedValue: ${transformedValue}`);
    if (!transformedValue.isValid()) {
      throw new BadRequestException('Invalid date');
    }

    return transformedValue.toDate();
  }
}
