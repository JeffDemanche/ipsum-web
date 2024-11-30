import {
  DeleteSharp,
  DoneSharp,
  DoubleArrowSharp,
  KeyboardArrowUpSharp,
  PriorityHighSharp,
} from "@mui/icons-material";
import cx from "classnames";
import { MiniButton } from "components/atoms/MiniButton";
import { ToggleButton } from "components/atoms/ToggleButton";
import { Tooltip } from "components/atoms/Tooltip";
import { Type } from "components/atoms/Type";
import { RelationsTableConnectedProps } from "components/hooks/use-arc-relations-table-connected";
import { BlurbExcerpt } from "components/molecules/BlurbExcerpt";
import { HighlightTag } from "components/molecules/HighlightTag";
import { RelationsTable } from "components/molecules/RelationsTable";
import { grey700, hueSwatch } from "components/styles";
import React, { useState } from "react";
import { IpsumDay } from "util/dates";
import { TestIds } from "util/test-ids";

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
  reviewState?:
    | { type: "none" }
    | { type: "not_up_for_review"; nextReviewDay: IpsumDay }
    | { type: "up_for_review" }
    | { type: "reviewed"; rating: number };

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

  const showRatingControls = upForReview || reviewState.type === "reviewed";

  const allowCardCreation = reviewState.type === "none";

  const ratedUp = reviewState.type === "reviewed" && reviewState.rating === 5;
  const ratedNeutral =
    reviewState.type === "reviewed" && reviewState.rating === 3;
  const ratedDown = reviewState.type === "reviewed" && reviewState.rating === 1;

  const toolTipForRating = (rating: number) => {
    if (!prospectiveIntervals) {
      return "No prospective interval";
    }

    const nextReviewDay = today.add(Math.ceil(prospectiveIntervals?.[rating]));

    return `Next review: ${nextReviewDay.toString("entry-printed-date")}`;
  };

  let blurbNotification = null;
  if (upForReview) {
    blurbNotification = (
      <div className={styles["blurb-notification"]}>
        <Tooltip title="Up for review">
          <PriorityHighSharp
            style={{
              color: hueSwatch(highlightProps.hue, "on_light_background"),
            }}
          />
        </Tooltip>
      </div>
    );
  } else if (reviewState.type === "reviewed") {
    blurbNotification = (
      <div className={styles["blurb-notification"]}>
        <Tooltip title="Reviewed">
          <DoneSharp
            style={{
              color: hueSwatch(highlightProps.hue, "on_light_background"),
            }}
          />
        </Tooltip>
      </div>
    );
  } else if (reviewState.type === "not_up_for_review" && !expanded) {
    blurbNotification = (
      <div className={styles["blurb-notification"]}>
        <Tooltip title="Not up for review">
          <Type size="small" color={grey700}>
            {daysUntilReview}d
          </Type>
        </Tooltip>
      </div>
    );
  }

  const blurbRatingControls = (
    <>
      {showRatingControls && (
        <>
          <ToggleButton
            tooltip={toolTipForRating(5)}
            onClick={() => {
              onRate(5);
            }}
            value="check"
            selected={ratedUp}
            disableShadow
          >
            <Type size="small">
              {prospectiveIntervals?.[5].toPrecision(2) ?? 0}d
            </Type>
          </ToggleButton>
          <ToggleButton
            tooltip={toolTipForRating(3)}
            onClick={() => {
              onRate(3);
            }}
            value="check"
            selected={ratedNeutral}
            disableShadow
          >
            <Type size="small">
              {prospectiveIntervals?.[3].toPrecision(2) ?? 0}d
            </Type>
          </ToggleButton>
          <ToggleButton
            tooltip={toolTipForRating(0)}
            onClick={() => {
              onRate(0);
            }}
            value="check"
            selected={ratedDown}
            disableShadow
          >
            <Type size="small">
              {prospectiveIntervals?.[0].toPrecision(2) ?? 0}d
            </Type>
          </ToggleButton>
        </>
      )}
      {notUpForReview && (
        <Type
          size="small"
          className={styles["days-until-review-text"]}
          color={grey700}
          tooltip={`Next review: ${reviewState.nextReviewDay.toString("entry-printed-date")}`}
        >
          {daysUntilReview}d
        </Type>
      )}
      {allowCardCreation && (
        <MiniButton
          tooltip="Start spaced repetition"
          onClick={onStartSRS}
          foregroundColor={grey700}
        >
          <DoubleArrowSharp />
        </MiniButton>
      )}
      <div style={{ flexGrow: "1" }}></div>
      <MiniButton
        tooltip="Collapse highlight"
        foregroundColor={grey700}
        onClick={onBlurbCollapse}
      >
        <KeyboardArrowUpSharp />
      </MiniButton>
    </>
  );

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
        {blurbRatingControls}
      </div>
      <div className={styles["blurb-right-column"]}>
        <div className={styles["blurb-header"]}>
          {blurbNotification}
          <HighlightTag
            fontSize="small"
            hue={highlightProps.hue}
            arcNames={highlightProps.arcNames}
            highlightNumber={highlightProps.highlightNumber}
            objectText={highlightProps.objectText}
            onObjectTextClick={onHighlightObjectClick}
            onHighlightClick={onHighlightClick}
          />
          <div
            className={cx(
              styles["blurb-expanded-action-buttons"],
              expanded && styles["expanded"]
            )}
          >
            <MiniButton
              data-testid={TestIds.HighlightBlurb.DeleteButton}
              onClick={onDelete}
              tooltip="Delete highlight"
              foregroundColor={grey700}
            >
              <DeleteSharp />
            </MiniButton>
          </div>
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
