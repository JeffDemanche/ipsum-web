import React, { useContext, useMemo } from "react";
import { useParams } from "react-router";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";
import { IpsumDateTime, sortDates } from "util/dates";

interface VisibleEntries {
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
  const sortedEntryKeys = sortDates(
    entryKeysInState.map((entryKey) =>
      IpsumDateTime.fromString(entryKey, "entry-printed-date")
    )
  );

  const { date } = useParams();

  const entryKeyFromURL = date
    ? IpsumDateTime.fromString(date, "url-format").toString(
        "entry-printed-date"
      )
    : undefined;

  const visibleEntryKeys = useMemo(() => {
    return entryKeyFromURL
      ? [entryKeyFromURL]
      : sortedEntryKeys
          .slice(0, DEFAULT_NUM_VISIBLE_ENTRIES)
          .map((entryKey) => entryKey.toString("entry-printed-date"));
  }, [entryKeyFromURL, sortedEntryKeys]);

  return (
    <VisibleEntriesContext.Provider value={{ visibleEntryKeys }}>
      {children}
    </VisibleEntriesContext.Provider>
  );
};
