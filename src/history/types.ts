import assert from "assert";
import { Model, TableOptions } from "sequelize-typescript";
import MeteoHistory from "src/db/models/meteoHistory.model";
import Scout from "src/db/models/scout.model";
import OmnicomHistory from "src/db/models/scoutHistory.model";
import ToiHistory from "src/db/models/toiHistory.model";
import { ActualClientToi } from "src/toi/toi.service";
import { NextCurrentTypeForResponse } from "src/user-history/types";
import { isNull } from "src/utils/common";

export type ToiHistoryResponseType = {
  rows: Array<ActualClientToi>;
  state: NextCurrentTypeForResponse;
};

export type OmnicomHistoryResponseType = {
  rows: Array<Scout>;
  state: NextCurrentTypeForResponse;
};

export type HistoryTableType = typeof ToiHistory | typeof OmnicomHistory | typeof MeteoHistory;

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

