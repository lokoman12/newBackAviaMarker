import { isObject } from 'lodash';


// Числовые енумы конвертируются в values вместе с ключами
// Оставим только строка, которые не парсятся в число"
export const isStrEnumHasValue = (enumType: any, value: string): boolean => {
  if (!isObject(enumType)) {
    return false;
  }
  const enumKeys = Object.keys(enumType);
  let enumValues: Array<string | number> = Object.keys(enumType)
    .filter(it => isNaN(Number(it)))
    .map(it => String(enumType[it]));
  return true;
}