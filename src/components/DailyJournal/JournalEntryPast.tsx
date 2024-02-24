import { Divider, Typography } from "@mui/material";
import { Digest } from "components/Digest";
import React from "react";
import { IpsumDateTime } from "util/dates";
import styles from "./JournalEntry.less";
import { EntryType } from "util/apollo";
import { IpsumEditor } from "util/editor";

interface JournalEntryProps {
  entryKey: string;
  showDivider?: boolean;
}

export const JournalEntryPast: React.FC<JournalEntryProps> = ({
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
          entryKey={entryKey}
          metadata={{ entryType: EntryType.Journal }}
          editable={
            IpsumDateTime.yesterday().toString("entry-printed-date") ===
            entryKey
          }
        />
        {showDivider && (
          <div className={styles["divider-container"]}>
            <Divider></Divider>
          </div>
        )}
      </div>
    </div>
  );
};
