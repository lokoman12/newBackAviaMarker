export const isNull = (value: any) =>
  value === null || value === undefined;

export const nonNull = (value: any) => !isNull(value);