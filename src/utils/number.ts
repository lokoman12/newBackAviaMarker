import { isNumber } from "util";

export const isNormalNumber = (value: number) =>
  isNumber(value) && !isNaN(value) && isFinite(value);

export const isPositiveNormalNumber = (value: number) =>
  isNormalNumber(value) && value > -1;
