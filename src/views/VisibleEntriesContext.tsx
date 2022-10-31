import React, { useContext, useMemo } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import { IpsumDateTime, sortDates } from "util/dates";

export interface VisibleEntries {
  visibleEntryKeys: string[];
}

const emptyVisibleEntries: VisibleEntries = {
  visibleEntryKeys: [],
};

export const VisibleEntriesContext =
  React.createContext<VisibleEntries>(emptyVisibleEntries);

const DEFAULT_NUM_VISIBLE_ENTRIES = 20;

export const VisibleEntriesProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }: { children: React.ReactElement }) => {
  const {
    state: { entries = undefined },
  } = useContext(InMemoryStateContext);

  const entryKeysInState = Object.keys(entries);
  const sortedEntryDateTimes = sortDates(
    entryKeysInState.map((entryKey) =>
      IpsumDateTime.fromString(entryKey, "entry-printed-date")
    )
  );

  const [searchParams] = useSearchParams();

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const { date } = useParams();

  const visibleEntryKeys = useMemo(() => {
    let dateRangeEntries = sortedEntryDateTimes;

    if (startDate && endDate) {
      dateRangeEntries = sortedEntryDateTimes.filter((dateTime) =>
        dateTime.isInRange(
          IpsumDateTime.fromString(startDate, "url-format"),
          IpsumDateTime.fromString(endDate, "url-format")
        )
      );
    } else if (date) {
      dateRangeEntries = [IpsumDateTime.fromString(date, "url-format")];
    }

    return dateRangeEntries
      .slice(0, DEFAULT_NUM_VISIBLE_ENTRIES)
      .map((entryKey) => entryKey.toString("entry-printed-date"));
  }, [date, endDate, sortedEntryDateTimes, startDate]);

  return (
    <VisibleEntriesContext.Provider value={{ visibleEntryKeys }}>
      {children}
    </VisibleEntriesContext.Provider>
  );
};
