import * as dayjs from "dayjs";
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as utc from 'dayjs/plugin/utc';
import { nonNull } from "./common";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const MIN_VALID_CALENDAR_YEAR = 2024;
const MIN_VALID_CALENDAR_YEAR_DAYJS = dayjs().year(MIN_VALID_CALENDAR_YEAR)

export const isLessThenMinValue = (date: dayjs.Dayjs) => {
  return MIN_VALID_CALENDAR_YEAR_DAYJS.isAfter(date.startOf('y'));
}

export const isValidDate = (date: dayjs.Dayjs | null) => {
  return nonNull(date)
    && date.isValid()
    && isLessThenMinValue(date.startOf('y'));
}

export default dayjs;