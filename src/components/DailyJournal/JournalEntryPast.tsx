import { Divider, Typography } from "@mui/material";
import { Digest } from "components/Digest";
import React from "react";
import { IpsumDateTime, IpsumDay } from "util/dates";
import styles from "./JournalEntry.less";
import { EntryType } from "util/apollo";
import { PastDayReflections } from "components/DayReflections";
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
            "entry-printed-date-nice"
          )}
        </Typography>
        <PastDayReflections day={IpsumDay.fromString(entryKey, "stored-day")} />
        <Digest entryKey={entryKey} className={styles["digest"]} />
        <IpsumEditor
          entryKey={entryKey}
          metadata={{ entryType: EntryType.Journal }}
          editable={false}
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
