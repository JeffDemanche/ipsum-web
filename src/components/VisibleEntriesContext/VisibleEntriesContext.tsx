import { useQuery } from "@apollo/client";
import React, { useMemo } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { gql } from "util/apollo";
import { IpsumDateTime, sortDates } from "util/dates";

export interface VisibleEntries {
  visibleEntryKeys: string[];
  visibleDateRangeStart: IpsumDateTime;
  visibleDateRangeEnd: IpsumDateTime;
}

const emptyVisibleEntries: VisibleEntries = {
  visibleEntryKeys: [],
  visibleDateRangeStart: IpsumDateTime.fromJsDate(new Date()),
  visibleDateRangeEnd: IpsumDateTime.fromJsDate(new Date()),
};

export const VisibleEntriesContext =
  React.createContext<VisibleEntries>(emptyVisibleEntries);

const DEFAULT_NUM_VISIBLE_ENTRIES = 20;

const VisibleEntriesProviderQuery = gql(`
  query VisibleEntries {
    entries {
      entryKey
      date
    }
  }
`);

export const VisibleEntriesProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }: { children: React.ReactElement }) => {
  const {
    data: { entries },
  } = useQuery(VisibleEntriesProviderQuery);

  const [searchParams] = useSearchParams();

  const sort = searchParams.get("sort");

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const { date } = useParams();

  const entryKeysInState = entries.map((entry) => entry.entryKey);
  const sortedEntryDateTimes = sortDates(
    entryKeysInState.map((entryKey) =>
      IpsumDateTime.fromString(entryKey, "entry-printed-date")
    ),
    sort === "asc"
  );

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

    if (sort === "asc") {
      return dateRangeEntries
        .slice(-DEFAULT_NUM_VISIBLE_ENTRIES)
        .map((entryKey) => entryKey.toString("entry-printed-date"));
    } else {
      return dateRangeEntries
        .slice(0, DEFAULT_NUM_VISIBLE_ENTRIES)
        .map((entryKey) => entryKey.toString("entry-printed-date"));
    }
  }, [date, endDate, sort, sortedEntryDateTimes, startDate]);

  const visibleDateRangeStart = startDate
    ? IpsumDateTime.fromString(startDate, "url-format")
    : sortDates(
        visibleEntryKeys.map((entryKey) =>
          IpsumDateTime.fromString(entryKey, "entry-printed-date")
        ),
        true
      )[0];

  const visibleDateRangeEnd = endDate
    ? IpsumDateTime.fromString(endDate, "url-format")
    : sortDates(
        visibleEntryKeys.map((entryKey) =>
          IpsumDateTime.fromString(entryKey, "entry-printed-date")
        ),
        false
      )[0];

  return (
    <VisibleEntriesContext.Provider
      value={{ visibleEntryKeys, visibleDateRangeStart, visibleDateRangeEnd }}
    >
      {children}
    </VisibleEntriesContext.Provider>
  );
};
