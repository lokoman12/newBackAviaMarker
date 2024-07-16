import { ActualClientToi } from "src/toi/toi.service";
import { NextCurrentTypeForResponse } from "src/user-history/types";

export type ToiHistoryResponseType = {
  rows: Array<ActualClientToi>;
  state: NextCurrentTypeForResponse;
};