import cx from "classnames";
import { Digest } from "components/Digest";
import React from "react";
import { IpsumDateTime, IpsumDay } from "util/dates";
import styles from "./JournalEntry.less";
import { Typography } from "@mui/material";
import { EntryType, gql } from "util/apollo";
import { TodayDayReflections } from "components/DayReflections";
import { IpsumEditor } from "util/editor";
import { useQuery } from "@apollo/client";

interface JournalEntryTodayProps {
  entryKey: string;
}

const JournalEntryTodayQuery = gql(`
  query JournalEntryToday($entryKey: ID!) {
    journalEntry(entryKey: $entryKey) {
      entryKey
    }
  }
`);

/**
 * This renders an empty journal entry, with a date and placeholder text.
 */
export const JournalEntryToday: React.FC<JournalEntryTodayProps> = ({
  entryKey,
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
            "entry-printed-date-nice"
          )}
        </Typography>
        <TodayDayReflections
          day={IpsumDay.fromString(entryKey, "stored-day")}
        />
        <Digest entryKey={entryKey} className={styles["digest"]} />
        <IpsumEditor
          entryKey={entryKey}
          metadata={{ entryType: EntryType.Journal }}
        />
      </div>
    </div>
  );
};
