import * as dayjs from "dayjs";
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export default dayjs;