import { DoubleArrowSharp, KeyboardArrowUpSharp } from "@mui/icons-material";
import cx from "classnames";
import { MiniButton } from "components/atoms/MiniButton";
import { ToggleButton } from "components/atoms/ToggleButton";
import { Type } from "components/atoms/Type";
import { RelationsTableConnectedProps } from "components/hooks/use-arc-relations-table-connected";
import { BlurbExcerpt } from "components/molecules/BlurbExcerpt";
import { RelationsTable } from "components/molecules/RelationsTable";
import { grey700, hueSwatch } from "components/styles";
import React, { useState } from "react";
import { IpsumDay } from "util/dates";
import { TestIds } from "util/test-ids";

import {
  HighlightFunctionButtons,
  HighlightFunctionButtonsNotificationState,
} from "../HighlightFunctionButtons";
import {
  HighlightSRSButtons,
  HighlightSRSButtonsReviewState,
} from "../HighlightSRSButtons/HighlightSRSButtons";
import styles from "./HighlightBlurb.less";

interface HighlightBlurbProps {
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;

  highlightProps: {
    highlightId: string;
    objectText: string;
    hue: number;
    highlightNumber: number;
    arcNames: string[];
    importanceRating: number;
  };
  excerptProps: { htmlString: string; maxLines?: number };
  relations: React.ComponentProps<typeof RelationsTable>["relations"];

  selected?: boolean;
  onSelect?: () => void;

  defaultExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;

  onDelete?: () => void;

  today: IpsumDay;
  reviewState?: HighlightSRSButtonsReviewState;

  onStartSRS?: () => void;

  prospectiveIntervals?: number[];
  onRate?: (q: number) => void;

  onHighlightClick?: () => void;
  onHighlightObjectClick?: () => void;

  relationsTableProps: RelationsTableConnectedProps;
}

export const HighlightBlurb: React.FunctionComponent<HighlightBlurbProps> = ({
  className,
  highlightProps,
  excerptProps,
  relations,
  selected,
  onSelect,
  defaultExpanded,
  onExpand,
  onCollapse,
  onDelete,
  reviewState,
  onStartSRS,
  prospectiveIntervals,
  onRate,
  onHighlightClick,
  onHighlightObjectClick,
  relationsTableProps,
  today,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const onBlurbExpand = () => {
    setExpanded(true);
    onExpand?.();
  };

  const onBlurbCollapse = () => {
    setExpanded(false);
    onCollapse?.();
  };

  const onBlurbClick = () => {
    if (!expanded) {
      onBlurbExpand();
    }
  };

  const upForReview = reviewState.type === "up_for_review";
  const notUpForReview = reviewState.type === "not_up_for_review";
  const daysUntilReview =
    reviewState.type === "not_up_for_review"
      ? today.numDaysUntil(reviewState.nextReviewDay)
      : 0;

  const notificationState: React.ComponentProps<
    typeof HighlightFunctionButtons
  >["notificationState"] = ((): HighlightFunctionButtonsNotificationState => {
    if (upForReview) {
      return { type: "Up for review" };
    } else if (reviewState.type === "reviewed") {
      return { type: "Reviewed" };
    } else if (notUpForReview) {
      return { type: "Not up for review", daysUntilReview };
    } else {
      return { type: "Up for review" };
    }
  })();

  return (
    <div
      data-testid={TestIds.HighlightBlurb.HighlightBlurb}
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onClick={onBlurbClick}
      className={cx(
        className,
        styles["highlight-blurb-wrapper"],
        expanded && styles["expanded"]
      )}
      style={{
        borderColor: hueSwatch(highlightProps.hue, "light_background"),
      }}
    >
      <div
        className={cx(
          styles["blurb-left-column"],
          expanded && styles["expanded"]
        )}
      >
        <HighlightSRSButtons
          orientation="vertical"
          today={today}
          reviewState={reviewState}
          onRate={onRate}
          onStartSRS={onStartSRS}
          prospectiveIntervals={prospectiveIntervals}
        />
        <div style={{ flexGrow: "1" }}></div>
        <MiniButton
          tooltip="Collapse highlight"
          foregroundColor={grey700}
          onClick={onBlurbCollapse}
        >
          <KeyboardArrowUpSharp />
        </MiniButton>
      </div>
      <div className={styles["blurb-right-column"]}>
        <div className={styles["blurb-header"]}>
          <HighlightFunctionButtons
            orientation="horizontal"
            highlightHue={highlightProps.hue}
            notificationState={notificationState}
            onDelete={expanded && onDelete}
          />
        </div>
        <BlurbExcerpt
          highlightId={highlightProps.highlightId}
          highlightHue={highlightProps.hue}
          htmlString={excerptProps.htmlString}
          maxLines={expanded ? 0 : excerptProps.maxLines ?? 3}
          showLeftBorder={expanded}
        />
        {expanded && (
          <RelationsTable
            expanded={expanded}
            relations={relations}
            editable
            subjectType="Highlight"
            subjectId={highlightProps.highlightId}
            {...relationsTableProps}
          />
        )}
      </div>
    </div>
  );
};
