import { Divider, Typography } from "@mui/material";
import { Digest } from "components/Digest";
import React from "react";
import {
  createJournalEntry,
  deleteJournalEntry,
  EntryType,
  updateEntry,
} from "util/apollo";
import { IpsumDateTime, IpsumDay } from "util/dates";
import { IpsumEditor } from "util/editor";

import styles from "./JournalEntry.less";
import { JournalEntryComments } from "./JournalEntryComments";

interface JournalEntryProps {
  day: IpsumDay;
  entryKey: string;
  showDivider?: boolean;
}

export const JournalEntryPast: React.FC<JournalEntryProps> = ({
  day,
  entryKey,
  showDivider,
}: JournalEntryProps) => {
  return (
    <div className={styles["journal-entry"]} data-entry-key={entryKey}>
      <div className={styles["entry-text-vertical"]}>
        <Typography
          variant="h3"
          color={(theme) => theme.palette.onSurfaceHighEmphasis}
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
          editable={
            IpsumDateTime.yesterday().toString("entry-printed-date") ===
            entryKey
          }
        />
        <JournalEntryComments day={day} />
        {showDivider && (
          <div className={styles["divider-container"]}>
            <Divider></Divider>
          </div>
        )}
      </div>
    </div>
  );
};
