import React, { useContext, useEffect, useState } from "react";
import { SurfaceControls } from "./SurfaceControls";
import { JournalEntryPast } from "./JournalEntryPast";
import { JournalEntryToday } from "./JournalEntryToday";

import { useDateString } from "util/dates";
import { JournalStateContext } from "state/JournalStateContext";

/**
 * Component that renders all loaded entries, including today's.
 */
export const SurfaceEditor = () => {
  const { getAllEntryKeys } = useContext(JournalStateContext);

  // TODO Smarter loading
  const [allEntryKeys, setAllEntryKeys] = useState<string[]>();
  useEffect(() => {
    getAllEntryKeys?.().then((entryKeys) => {
      setAllEntryKeys(Array.from(entryKeys));
    });
  }, [getAllEntryKeys]);

  const today = useDateString(30000, "month-day-year-slashes");

  const todayEntryComponent = (
    <JournalEntryToday entryKey={today}></JournalEntryToday>
  );

  const entryEditorComponents =
    allEntryKeys &&
    Array.from(allEntryKeys)
      .filter((entryKey) => entryKey !== today)
      .sort((a, b) => Date.parse(b) - Date.parse(a))
      .map((sortedEntryKey, i) => (
        <JournalEntryPast entryKey={sortedEntryKey} key={i}></JournalEntryPast>
      ));

  return (
    <>
      {todayEntryComponent}
      {entryEditorComponents}
      <SurfaceControls />
    </>
  );
};
