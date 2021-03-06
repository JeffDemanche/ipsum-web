import React, { useContext, useEffect, useMemo, useState } from "react";
import { SurfaceControls } from "./SurfaceControls";
import { JournalEntryPast } from "./JournalEntryPast";
import { JournalEntryToday } from "./JournalEntryToday";

import { useDateString } from "util/dates";
import { VisibleEntriesContext } from "views/VisibleEntriesContext";

/**
 * Component that renders all loaded entries, including today's.
 */
export const SurfaceEditor = () => {
  const { visibleEntryKeys } = useContext(VisibleEntriesContext);

  const today = useDateString(30000, "entry-printed-date");

  const todayEntryComponent = (
    <JournalEntryToday entryKey={today} key={today}></JournalEntryToday>
  );

  const entryEditorComponents =
    visibleEntryKeys &&
    visibleEntryKeys
      .filter((entryKey) => entryKey !== today)
      .sort((a, b) => Date.parse(b) - Date.parse(a))
      .map((sortedEntryKey) => {
        return (
          <JournalEntryPast
            entryKey={sortedEntryKey}
            key={sortedEntryKey}
          ></JournalEntryPast>
        );
      });

  return (
    <>
      {todayEntryComponent}
      {entryEditorComponents}
      <SurfaceControls />
    </>
  );
};
