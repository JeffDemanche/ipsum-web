import { EntryEditor } from "components/atoms/EntryEditor";
import { Type } from "components/atoms/Type";
import { HighlightTag } from "components/molecules/HighlightTag";
import React from "react";
import { IpsumDay } from "util/dates";

import styles from "./Entry.less";

interface EntryProps {
  entryDay?: IpsumDay;
  highlights: {
    highlightId: string;
    highlightNumber: number;
    hue: number;
    arcNames: string[];
  }[];
  editable?: boolean;
  htmlString?: string;

  createEntry?: (htmlString: string) => string;
  updateEntry?: ({
    entryKey,
    htmlString,
  }: {
    entryKey: string;
    htmlString: string;
  }) => boolean;
  deleteEntry?: (entryKey: string) => void;
  createHighlight?: () => string;
}

export const Entry: React.FunctionComponent<EntryProps> = ({
  entryDay,
  highlights,
  editable = false,
  htmlString,
  createEntry,
  updateEntry,
  deleteEntry,
  createHighlight,
}) => {
  const highlightsMarkup = highlights.map((highlight) => (
    <HighlightTag
      key={highlight.highlightId}
      hue={highlight.hue}
      fontSize="small"
      arcNames={highlight.arcNames}
      highlightNumber={highlight.highlightNumber}
    />
  ));

  return (
    <div className={styles["entry"]}>
      {entryDay && (
        <Type variant="serif" size="large">
          {entryDay.toString("entry-printed-date-nice-with-year")}
        </Type>
      )}
      <div className={styles["highlights-list"]}>{highlightsMarkup}</div>
      <EntryEditor
        className={styles["entry-ipsum-editor"]}
        editable={editable}
        initialHtmlString={htmlString}
        createEntry={createEntry}
        updateEntry={updateEntry}
        deleteEntry={deleteEntry}
        createHighlight={createHighlight}
      />
    </div>
  );
};
