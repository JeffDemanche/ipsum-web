import { Typography } from "@mui/material";
import React from "react";
import { EntryType } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumEditor } from "util/editor";

interface HighlightCommentProps {
  depth: number;
  dayIso: string;
  commentId: string;
  commentEntryKey: string;
  editable: boolean;
  htmlString: string;
}

export const HighlightComment: React.FunctionComponent<
  HighlightCommentProps
> = ({ depth, dayIso, commentId, commentEntryKey, editable, htmlString }) => {
  return (
    <div>
      <Typography variant="h4">
        {IpsumDay.fromString(dayIso, "iso").toString(
          "entry-printed-date-nice-with-year"
        )}
      </Typography>
      <IpsumEditor
        entryKey={commentEntryKey}
        metadata={{ entryType: EntryType.Comment, commentId }}
        editable={editable}
      />
    </div>
  );
};
