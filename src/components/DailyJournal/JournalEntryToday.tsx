import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import cx from "classnames";
import { Digest } from "components/Digest";
import React from "react";
import {
  createJournalEntry,
  deleteJournalEntry,
  EntryType,
  gql,
  updateEntry,
} from "util/apollo";
import { IpsumDateTime, IpsumDay } from "util/dates";
import { IpsumEditor } from "util/editor";

import styles from "./JournalEntry.less";
import { JournalEntryComments } from "./JournalEntryComments";

interface JournalEntryTodayProps {
  entryKey: string;
  day: IpsumDay;
}

const JournalEntryTodayQuery = gql(`
  query JournalEntryToday($entryKey: ID!) {
    journalEntry(entryKey: $entryKey) {
      entryKey
      entry {
        date
      }
    }
  }
`);

/**
 * This renders an empty journal entry, with a date and placeholder text.
 */
export const JournalEntryToday: React.FC<JournalEntryTodayProps> = ({
  entryKey,
  day,
}: JournalEntryTodayProps) => {
  const { data } = useQuery(JournalEntryTodayQuery, {
    variables: { entryKey },
  });

  const empty = !data?.journalEntry;

  return (
    <div className={styles["journal-entry"]}>
      <div className={styles["entry-text-vertical"]}>
        <Typography
          variant="h3"
          color={(theme) =>
            empty
              ? theme.palette.onSurfaceDisabled
              : theme.palette.onSurfaceHighEmphasis
          }
          className={cx(styles["entry-heading"], {
            [styles["empty-entry"]]: empty,
          })}
        >
          {IpsumDateTime.fromString(entryKey, "entry-printed-date").toString(
            "entry-printed-date-nice-with-year"
          )}
        </Typography>
        <Digest entryKey={entryKey} className={styles["digest"]} />
        <IpsumEditor
          defaultEntryKey={entryKey}
          createEntry={(htmlString) => {
            createJournalEntry({
              entryKey,
              htmlString,
              entryType: EntryType.Journal,
            });
            return entryKey;
          }}
          updateEntry={({ entryKey, htmlString }) => {
            return !!updateEntry({
              entryKey,
              htmlString,
            });
          }}
          deleteEntry={(entryKey) => {
            deleteJournalEntry({ entryKey });
          }}
          metadata={{ entryType: EntryType.Journal }}
        />
        <JournalEntryComments day={day} />
      </div>
    </div>
  );
};
