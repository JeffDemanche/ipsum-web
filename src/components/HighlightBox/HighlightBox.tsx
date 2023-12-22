import { Card, Typography } from "@mui/material";
import { DiptychContext } from "components/DiptychContext";
import { HighlightExcerpt } from "components/HighlightExcerpt";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import styles from "./HighlightBox.less";
import cx from "classnames";
import { gql } from "util/apollo";
import { useQuery } from "@apollo/client";
import { IpsumDateTime, IpsumDay, parseIpsumDateTime } from "util/dates";
import { HighlightBoxButtons } from "./HighlightBoxButtons";
import { HighlightBoxRelations } from "./HighlightBoxRelations";

interface HighlightBoxProps {
  highlightId: string;
  variant?: "collapsed" | "expanded";

  showDate?: boolean;

  selected?: boolean;
  onSelect?: (selected: boolean, day: IpsumDay) => void;

  hovered?: boolean;
  onHover?: (hovered: boolean) => void;
}

const HighlightBoxQuery = gql(`
  query HighlightBox($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      entry {
        entryKey
        date
      }
      outgoingRelations {
        __typename
        predicate
        object {
          ... on Arc {
            id
            color
          }
        }
      }
    }
  }
`);

export const HighlightBox: React.FunctionComponent<HighlightBoxProps> = ({
  highlightId,
  variant = "expanded",
  showDate,
  selected,
  onSelect,
  hovered,
  onHover,
}) => {
  const { data } = useQuery(HighlightBoxQuery, {
    variables: { highlightId },
  });

  const { pushLayer } = useContext(DiptychContext);

  const highlight = data?.highlight;

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

  useEffect(() => {
    if (selected) {
      boxRef.current.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [selected]);

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
      variant="translucent"
      onClick={onCardClick}
      className={cx(selected && styles["selected"], styles["box"])}
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
          <HighlightBoxButtons highlightId={highlightId} />
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
        </div>
      )}

      {variant !== "collapsed" && (
        <HighlightExcerpt
          className={styles["excerpt"]}
          highlightId={highlightId}
          charLimit={selected ? undefined : 200}
        />
      )}

      {selected && (
        <div className={styles["bottom-controls-container"]}>
          <HighlightBoxRelations highlightId={highlightId} />
        </div>
      )}
    </Card>
  );
};
