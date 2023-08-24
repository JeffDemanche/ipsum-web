import { useQuery } from "@apollo/client";
import { DailyJournalLayer } from "components/DiptychContext";
import React, { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { gql } from "util/apollo";
import { IpsumDateTime, sortDates } from "util/dates";
import { dataToSearchParams, urlToData } from "util/url";

export interface VisibleEntries {
  visibleEntryKeys: string[];
  visibleDateRangeStart: IpsumDateTime;
  visibleDateRangeEnd: IpsumDateTime;
  loadMoreNext: (count: number) => void;
  loadMorePrevious: (count: number) => void;
}

const emptyVisibleEntries: VisibleEntries = {
  visibleEntryKeys: [],
  visibleDateRangeStart: IpsumDateTime.fromJsDate(new Date()),
  visibleDateRangeEnd: IpsumDateTime.fromJsDate(new Date()),
  loadMoreNext: () => {},
  loadMorePrevious: () => {},
};

export const VisibleEntriesContext =
  React.createContext<VisibleEntries>(emptyVisibleEntries);

const DEFAULT_NUM_VISIBLE_ENTRIES = 20;

const VisibleEntriesProviderQuery = gql(`
  query VisibleEntries {
    journalEntries {
      entryKey
      entry {
        entryKey
        date
      }
    }
  }
`);

export const VisibleEntriesProvider: React.FC<{
  layer: DailyJournalLayer;
  children: React.ReactElement;
}> = ({ layer, children }) => {
  const {
    data: { journalEntries },
  } = useQuery(VisibleEntriesProviderQuery);

  let sort: "asc" | "desc" = "desc";
  sort = "desc";

  const startDate = layer.startDate;
  const endDate = layer.endDate;

  const { date } = useParams();

  const entryKeysInState = journalEntries.map(
    (journalEntry) => journalEntry.entryKey
  );
  const sortedEntryDateTimes = sortDates(
    entryKeysInState.map((entryKey) =>
      IpsumDateTime.fromString(entryKey, "entry-printed-date")
    ),
    true
  );

  const visibleEntryDateTimes = useMemo(() => {
    let dateRangeEntries = sortedEntryDateTimes;

    if (startDate && endDate) {
      dateRangeEntries = sortedEntryDateTimes.filter((dateTime) => {
        return dateTime.isInRange(
          IpsumDateTime.fromString(startDate, "url-format"),
          IpsumDateTime.fromString(endDate, "url-format")
        );
      });
    } else if (date) {
      dateRangeEntries = [IpsumDateTime.fromString(date, "url-format")];
    }

    if (sort === "asc") {
      return dateRangeEntries.slice(-DEFAULT_NUM_VISIBLE_ENTRIES);
    } else {
      return dateRangeEntries.slice(0, DEFAULT_NUM_VISIBLE_ENTRIES);
    }
  }, [date, endDate, sort, sortedEntryDateTimes, startDate]);

  const visibleEntryKeys = useMemo(() => {
    if (sort === "desc") {
      return visibleEntryDateTimes
        .reverse()
        .map((entryDateTime) => entryDateTime.toString("entry-printed-date"));
    } else {
      return visibleEntryDateTimes.map((entryDateTime) =>
        entryDateTime.toString("entry-printed-date")
      );
    }
  }, [sort, visibleEntryDateTimes]);

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

  const navigate = useNavigate();

  const loadMoreNext = useCallback(
    (count: number) => {
      const datesAfterEnd = sortedEntryDateTimes.filter((dateTime) => {
        return (
          dateTime.dateTime.toJSDate() > visibleDateRangeEnd.dateTime.toJSDate()
        );
      });
      const newEndDate = datesAfterEnd[count - 1] ?? datesAfterEnd.slice(-1)[0];

      const newParams = urlToData<"journal">(window.location.href);
      const urlLayer = newParams.layers[layer.index];
      if (urlLayer.type === "daily_journal" && newEndDate) {
        urlLayer.endDate = newEndDate.toString("url-format");

        navigate(
          { search: dataToSearchParams<"journal">(newParams) },
          { replace: true }
        );
      }
    },
    [layer.index, navigate, sortedEntryDateTimes, visibleDateRangeEnd.dateTime]
  );

  const loadMorePrevious = useCallback(
    (count: number) => {
      const datesBeforeStart = sortedEntryDateTimes
        .filter((dateTime) => {
          return (
            dateTime.dateTime.toJSDate() <
            visibleDateRangeStart.dateTime.toJSDate()
          );
        })
        .reverse();
      const newStartDate =
        datesBeforeStart[count - 1] ?? datesBeforeStart.slice(-1)[0];

      const newParams = urlToData<"journal">(window.location.href);
      const urlLayer = newParams.layers[layer.index];
      if (urlLayer.type === "daily_journal" && newStartDate) {
        urlLayer.startDate = newStartDate.toString("url-format");

        navigate(
          { search: dataToSearchParams<"journal">(newParams) },
          { replace: true }
        );
      }
    },
    [
      layer.index,
      navigate,
      sortedEntryDateTimes,
      visibleDateRangeStart.dateTime,
    ]
  );

  return (
    <VisibleEntriesContext.Provider
      value={{
        visibleEntryKeys,
        visibleDateRangeStart,
        visibleDateRangeEnd,
        loadMoreNext,
        loadMorePrevious,
      }}
    >
      {children}
    </VisibleEntriesContext.Provider>
  );
};
