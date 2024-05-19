import { Card, Typography } from "@mui/material";
import cx from "classnames";
import { DiptychContext } from "components/DiptychContext";
import { HighlightExcerptConnected } from "components/HighlightExcerpt";
import { HighlightRelationsTable } from "components/HighlightRelationsTable";
import React, { useCallback, useContext, useRef } from "react";
import { IpsumDateTime, IpsumDay, parseIpsumDateTime } from "util/dates";

import styles from "./HighlightBox.less";
import { HighlightBoxButtons } from "./HighlightBoxButtons";
import { ImportanceRatingButton } from "./ImportanceRatingButton";

interface HighlightBoxProps {
  className?: string;

  highlight: {
    id: string;
    entry: {
      date: string;
    };
    currentImportance: number;
    outgoingRelations: {
      predicate: string;
      object: {
        id: string;
        color: number;
      };
    }[];
  };
  variant?: "collapsed" | "expanded";

  showDate?: boolean;

  selected?: boolean;
  onSelect?: (selected: boolean, day: IpsumDay) => void;

  hovered?: boolean;
  onHover?: (hovered: boolean) => void;
}

export const HighlightBox: React.FunctionComponent<HighlightBoxProps> = ({
  className,
  highlight,
  variant = "expanded",
  showDate,
  selected,
  onSelect,
  hovered,
  onHover,
}) => {
  const { pushLayer } = useContext(DiptychContext);

  const entryDate = parseIpsumDateTime(highlight.entry.date).toString(
    "entry-printed-date-nice"
  );

  const onCardClick = useCallback(() => {
    const highlightDay = IpsumDay.fromIpsumDateTime(
      parseIpsumDateTime(highlight.entry.date)
    );

    onSelect?.(!selected, highlightDay);
  }, [highlight, onSelect, selected]);

  const boxRef = useRef<HTMLDivElement>(null);

  const onDateClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      pushLayer({
        type: "daily_journal",
        mode: "past",
        visibleDates: [
          IpsumDateTime.fromString(highlight.entry.date, "iso").toString(
            "url-format"
          ),
        ],
      });
    },
    [highlight, pushLayer]
  );

  return (
    <Card
      onMouseEnter={() => {
        onHover?.(true);
      }}
      onMouseLeave={() => {
        onHover?.(false);
      }}
      variant={selected ? "elevation" : "translucent"}
      onClick={onCardClick}
      className={cx(className, selected && styles["selected"], styles["box"])}
      data-testid="median-highlight-box"
      ref={boxRef}
    >
      {selected ? (
        <div
          className={cx(styles["selected"], styles["top-controls-container"])}
        >
          {showDate && (
            <Typography variant="caption" className={styles["highlight-title"]}>
              <a onClick={onDateClick} href="#">
                {entryDate}
              </a>
            </Typography>
          )}
          <HighlightBoxButtons highlightId={highlight.id} />
        </div>
      ) : (
        <div className={cx(styles["top-controls-container"])}>
          {showDate && (
            <Typography variant="caption" className={styles["highlight-title"]}>
              <a onClick={onDateClick} href="#">
                {entryDate}
              </a>
            </Typography>
          )}
          <div className={styles["unselected-info-header"]}>
            <ImportanceRatingButton highlightId={highlight.id} />
          </div>
        </div>
      )}

      {variant !== "collapsed" && (
        <HighlightExcerptConnected
          paperClassName={styles["excerpt"]}
          highlightId={highlight.id}
        />
      )}
      <div className={styles["bottom-controls-container"]}>
        <HighlightRelationsTable
          highlightId={highlight.id}
          showPlusButton={selected}
        />
      </div>
    </Card>
  );
};
