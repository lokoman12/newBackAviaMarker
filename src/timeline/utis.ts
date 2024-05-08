export enum JobPrefixEnum {
  airNavigation = 'air-navigation',
  copyHistoryRecord = 'copy-history-data',
};

type JobPrefixEnumKeys = keyof typeof JobPrefixEnum;

export const getJobNameByTableNumber = (tableNumber: number): string => {
return `${JobPrefixEnum.copyHistoryRecord}_${tableNumber}`;
}

export const getActualAirNavDataJob = (tableNumber: number = 0): string => {
return `${JobPrefixEnum.airNavigation}__${tableNumber}`;
}

export const getCopyHistoryName = (tableNumber: number) => {
return `${JobPrefixEnum.copyHistoryRecord}__${tableNumber}`;
}