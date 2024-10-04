import { Logger, InternalServerErrorException } from "@nestjs/common";

export enum HistoryErrorCodeEnum {
  userStatusNotFound = 1,
  emptyHistoryResult = 2,
  invalidDateValue = 3,
  historyTableIsBusy = 4,
  userIsAlreadyInRecordStatus = 5,
  sqlClearTableCanNotPerfomed = 6,
  sqlInsertTableCanNotPerfomed = 7,
  sqlSelectTableCanNotPerfomed = 8,
  invalidStepValue = 9,
  copyHistoryError = 10,
  copyOmnicomError = 11,
  copyMeteoError = 12,
  sqlPrepareTablesCanNotPerfomed = 13,
  canNotSaveHistoryStage = 14,
  unknownHistoryError = 100,
};

export type ErrorObjectType = {
  errorCode: HistoryErrorCodeEnum;
  description?: string;
}

export class HistoryBadStateException extends InternalServerErrorException {
  private readonly logger = new Logger(HistoryBadStateException.name);

  constructor(login: string, code: HistoryErrorCodeEnum, description?: string) {
    let message = `Ошибка при работе с историей пользователя ${login}!`;
    if (description) {
      message += ` ${description}`;
    }

    const error = new Error();
    const errorObject: ErrorObjectType = {
      errorCode: code,
    };
    if (description) {
      errorObject.description = description;
    }

    super(
      errorObject,
      {
        description: `Ошибка при работе с историей пользователя ${login}. ${message}!`,
      }
    );
    this.name = this.constructor.name;
    this.message = message;
    this.stack = error.stack;
    Error.captureStackTrace(this, this.constructor);
    this.logger.error(error.stack);
  }
}