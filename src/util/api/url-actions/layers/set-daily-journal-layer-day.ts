import type { IpsumDay } from "util/dates";
import type { DailyJournalURLLayer } from "util/state";

import type { URLFunction } from "../types";

export const setDailyJournalLayerDay: URLFunction<
  { index: number; day: IpsumDay },
  "journal"
> = (props, state) => {
  if (!state.layers[props.index]) {
    throw new Error(`Layer at index ${props.index} does not exist in URL`);
  }

  if (state.layers[props.index].type !== "daily_journal") {
    throw new Error(
      `Layer at index ${props.index} is not a daily journal layer`
    );
  }

  (state.layers[props.index] as DailyJournalURLLayer).day =
    props.day.toString("url-format");
  return state;
};
