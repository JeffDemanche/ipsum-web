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
  maxLines?: number;
  showHighlights?: boolean;

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

  onHighlightClick?: (highlightId: string) => void;
}

export const Entry: React.FunctionComponent<EntryProps> = ({
  entryDay,
  highlights,
  editable = false,
  htmlString,
  maxLines,
  showHighlights = true,
  createEntry,
  updateEntry,
  deleteEntry,
  createHighlight,
  onHighlightClick,
}) => {
  const highlightsMarkup = highlights.map((highlight) => (
    <HighlightTag
      key={highlight.highlightId}
      hue={highlight.hue}
      fontSize="small"
      arcNames={highlight.arcNames}
      highlightNumber={highlight.highlightNumber}
      onHighlightClick={() => onHighlightClick(highlight.highlightId)}
    />
  ));

  const highlightsMap = highlights.reduce(
    (prev, cur) => {
      prev[cur.highlightId] = {
        id: cur.highlightId,
        hue: cur.hue,
      };
      return prev;
    },
    {} as React.ComponentProps<typeof EntryEditor>["highlightsMap"]
  );

  return (
    <div className={styles["entry"]}>
      {entryDay && (
        <Type variant="serif" size="large">
          {entryDay.toString("entry-printed-date-nice-with-year")}
        </Type>
      )}
      {showHighlights && !!highlights.length && (
        <div className={styles["highlights-list"]}>{highlightsMarkup}</div>
      )}
      <EntryEditor
        className={styles["entry-ipsum-editor"]}
        editable={editable}
        initialHtmlString={htmlString}
        maxLines={maxLines}
        highlightsMap={highlightsMap}
        createEntry={createEntry}
        updateEntry={updateEntry}
        deleteEntry={deleteEntry}
        createHighlight={createHighlight}
      />
    </div>
  );
};
