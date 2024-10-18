import { Model, TableOptions } from "sequelize-typescript";
import AznbHistory from "src/db/models/aznbHistory.model";
import MeteoHistory from "src/db/models/meteoHistory.model";
import OmnicomHistory from "src/db/models/scoutHistory.model";
import StandsHistory from "src/db/models/standsHistory.model";
import ToiHistory from "src/db/models/toiHistory.model";
import { NextCurrentTypeForResponse } from "src/user-history/types";
import { isNull } from "src/utils/common";

export type HistoryList = Array<ToiHistory | OmnicomHistory | OmnicomHistory | MeteoHistory | StandsHistory | AznbHistory>;

export type HistoryArrayOfLists = Array<Array<ToiHistory> | Array<OmnicomHistory> | Array<MeteoHistory> | Array<StandsHistory> | Array<AznbHistory>>;

export type HistoryResponseType = {
  rows: HistoryList;
  state: NextCurrentTypeForResponse;
};

export type HistoryResponsePackType = {
  rows: HistoryArrayOfLists;
  state: NextCurrentTypeForResponse;
};

export type HistoryTableType = typeof ToiHistory | typeof OmnicomHistory | typeof MeteoHistory | typeof StandsHistory | typeof AznbHistory | typeof HistoryModel;

export type TableNameRequiredType = Required<Pick<TableOptions, 'tableName'>>;

export const getModelTableName = (model: HistoryTableType): string => {
  const tableName = (model as any).tableName;
  if (isNull(tableName)) {
    throw new Error('Модель в аннотации должна иметь атрибут tableName!');
  }
  return tableName;
};

export function Table(options: TableOptions & TableNameRequiredType): Function {
  if (!options.tableName) {
    throw new Error("Параметр tableName обязателен!");
  }

  return function (constructor: typeof Model) {
    // Здесь вызываем оригинальную функцию Table из sequelize-typescript
    return (require('sequelize-typescript').Table as any)(options)(constructor);
  };
}

export abstract class HistoryModel<TModelAttributes extends {} = any, TCreationAttributes extends {} = TModelAttributes> extends Model<TModelAttributes, TCreationAttributes> {
  id: number;
  time: Date;
  step: number;
}

export type Constructor<T> = new (...args: any[]) => T;
export type ModelType<T extends HistoryModel<T>> = Constructor<T> & typeof HistoryModel;

