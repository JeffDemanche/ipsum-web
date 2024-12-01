import { DoubleArrowSharp } from "@mui/icons-material";
import cx from "classnames";
import { MiniButton } from "components/atoms/MiniButton";
import { ToggleButton } from "components/atoms/ToggleButton";
import { Type } from "components/atoms/Type";
import { grey700 } from "components/styles";
import React from "react";
import { IpsumDay } from "util/dates";

import styles from "./HighlightSRSButtons.less";

export type HighlightSRSButtonsReviewState =
  | { type: "none" }
  | { type: "not_up_for_review"; nextReviewDay: IpsumDay }
  | { type: "up_for_review" }
  | { type: "reviewed"; rating: number };

interface HighlightSRSButtonsProps {
  today: IpsumDay;
  orientation: "horizontal" | "vertical";
  prospectiveIntervals?: number[];
  reviewState: HighlightSRSButtonsReviewState;

  onRate?: (q: number) => void;
  onStartSRS?: () => void;
}

export const HighlightSRSButtons: React.FunctionComponent<
  HighlightSRSButtonsProps
> = ({
  today,
  orientation,
  prospectiveIntervals,
  reviewState,
  onRate,
  onStartSRS,
}) => {
  const upForReview = reviewState.type === "up_for_review";

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

  return (
    <div className={cx(styles["srs-buttons"], styles[orientation])}>
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
      {allowCardCreation && onStartSRS && (
        <MiniButton
          tooltip="Start spaced repetition"
          onClick={onStartSRS}
          foregroundColor={grey700}
        >
          <DoubleArrowSharp />
        </MiniButton>
      )}
    </div>
  );
};
