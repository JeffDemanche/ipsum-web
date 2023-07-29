import React, { useContext } from "react";
import styles from "./DailyJournalEditor.less";
import { JournalEntryPast } from "./JournalEntryPast";
import { JournalEntryToday } from "./JournalEntryToday";

import { useDateString } from "util/dates";
import { VisibleEntriesContext } from "components/VisibleEntriesContext";
import { Button } from "@mui/material";
import { useQuery } from "@apollo/client";
import { gql } from "util/apollo";

const DailyJournalEditorQuery = gql(`
  query DailyJournalEditor($before: String!, $after: String!) {
    journalEntryDates(before: $before, after: $after) 
  }
`);

/**
 * Component that renders all loaded entries, including today's.
 */
export const DailyJournalEditor = () => {
  const { visibleEntryKeys, loadMoreNext, loadMorePrevious } = useContext(
    VisibleEntriesContext
  );

  const { data } = useQuery(DailyJournalEditorQuery, {
    variables: { before: "2021-10-01", after: "2021-09-01" },
  });

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
      <div className={styles["past-entries"]}>
        <Button
          variant="outlined"
          onClick={() => {
            loadMoreNext(1);
          }}
          className={styles["load-more-button"]}
        >
          Next entry
        </Button>
        {entryEditorComponents}
        <Button
          variant="outlined"
          onClick={() => {
            loadMorePrevious(1);
          }}
          className={styles["load-more-button"]}
        >
          Previous entry
        </Button>
      </div>
    </>
  );
};
