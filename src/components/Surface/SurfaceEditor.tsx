import React, { useContext } from "react";
import { SurfaceControls } from "./SurfaceControls";
import { SurfaceEditorContext } from "./SurfaceEditorContext";
import { JournalEntry } from "./JournalEntry";
import { getCurrentLocalDay } from "util/dates";
import { JournalEntryEmpty } from "./JournalEntryEmpty";
import { JournalStateContext } from "state/JournalStateContext";

export const SurfaceEditor = () => {
  const { loadedEntries } = useContext(JournalStateContext);

  const { entryEditorStates } = useContext(SurfaceEditorContext);

  const day = getCurrentLocalDay();

  const showEmptyToday = !Array.from(entryEditorStates.keys()).includes(day);

  const emptyEntryComponent = showEmptyToday && (
    <JournalEntryEmpty></JournalEntryEmpty>
  );

  const entryEditorComponents = Array.from(entryEditorStates.keys())
    .sort((a, b) => Date.parse(a) - Date.parse(b))
    .map((sortedEntryKey, i) => (
      <JournalEntry entryKey={sortedEntryKey} key={i}></JournalEntry>
    ));

  return (
    <>
      {emptyEntryComponent}
      {entryEditorComponents}
      <SurfaceControls />
    </>
  );
};
