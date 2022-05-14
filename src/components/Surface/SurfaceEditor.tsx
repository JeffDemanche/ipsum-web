import React, { useContext } from "react";
import { SurfaceControls } from "./SurfaceControls";
import { SurfaceEditorContext } from "./SurfaceEditorContext";
import { JournalEntry } from "./JournalEntry";
import { JournalEntryToday } from "./JournalEntryToday";

import { getCurrentLocalDay } from "util/dates";

/**
 * Component that renders all loaded entries, including today's.
 */
export const SurfaceEditor = () => {
  const { entryEditorStates } = useContext(SurfaceEditorContext);

  const today = getCurrentLocalDay();

  const todayEntryComponent = (
    <JournalEntryToday entryKey={today}></JournalEntryToday>
  );

  const entryEditorComponents = Array.from(entryEditorStates.keys())
    .filter((entryKey) => entryKey !== today)
    .sort((a, b) => Date.parse(a) - Date.parse(b))
    .map((sortedEntryKey, i) => (
      <JournalEntry entryKey={sortedEntryKey} key={i}></JournalEntry>
    ));

  return (
    <>
      {todayEntryComponent}
      {entryEditorComponents}
      <SurfaceControls />
    </>
  );
};
