import React, { useContext } from "react";
import { JournalEntryPast } from "./JournalEntryPast";
import { JournalEntryToday } from "./JournalEntryToday";
import styles from "./SurfaceEditor.less";

import { useDateString } from "util/dates";
import { VisibleEntriesContext } from "components/VisibleEntriesContext";

/**
 * Component that renders all loaded entries, including today's.
 */
export const SurfaceEditor = () => {
  const { visibleEntryKeys } = useContext(VisibleEntriesContext);

  const today = useDateString(30000, "entry-printed-date");

  const todayEntryComponent = (
    <JournalEntryToday
      entryKey={today}
      showDivider={!!visibleEntryKeys.length}
      key={today}
    ></JournalEntryToday>
  );

  const entryEditorComponents =
    visibleEntryKeys &&
    visibleEntryKeys
      .filter((entryKey) => entryKey !== today)
      .map((sortedEntryKey, i) => {
        return (
          <JournalEntryPast
            entryKey={sortedEntryKey}
            showDivider={i !== visibleEntryKeys.length - 1}
            key={sortedEntryKey}
          ></JournalEntryPast>
        );
      });

  return (
    <>
      {todayEntryComponent}
      {entryEditorComponents}
    </>
  );
};
