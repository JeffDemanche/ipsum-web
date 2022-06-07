import React, { useContext, useEffect, useMemo, useState } from "react";
import { SurfaceControls } from "./SurfaceControls";
import { JournalEntryPast } from "./JournalEntryPast";
import { JournalEntryToday } from "./JournalEntryToday";

import { useDateString } from "util/dates";
import { InMemoryStateContext } from "state/in-memory/InMemoryStateProvider";

/**
 * Component that renders all loaded entries, including today's.
 */
export const SurfaceEditor = () => {
  const { state } = useContext(InMemoryStateContext);

  const allEntryKeysFromState = useMemo(
    () => Object.values(state.entries).map((entry) => entry.entryKey),
    [state.entries]
  );

  // TODO Smarter loading
  const [allEntryKeys, setAllEntryKeys] = useState<string[]>();
  useEffect(() => {
    allEntryKeysFromState && setAllEntryKeys(allEntryKeysFromState);
  }, [allEntryKeysFromState]);

  const today = useDateString(30000, "entry-printed-date");

  const todayEntryComponent = (
    <JournalEntryToday entryKey={today}></JournalEntryToday>
  );

  const entryEditorComponents =
    allEntryKeys &&
    allEntryKeysFromState
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
