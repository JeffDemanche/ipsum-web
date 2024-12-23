import { useQuery } from "@apollo/client";
import type { HighlightFunctionButtons } from "components/molecules/HighlightFunctionButtons";
import type React from "react";
import {
  apiDeleteHighlight,
  urlRemoveHighlightLayer,
  useApiAction,
  useUrlAction,
} from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";

import { useHighlightReviewStateConnected } from "./use-highlight-review-state";

export type HighlightFunctionButtonsConnectedProps = Pick<
  React.ComponentProps<typeof HighlightFunctionButtons>,
  "highlightHue" | "notificationState" | "onDelete"
>;

interface UseHighlightFunctionButtonsConnectedProps {
  highlightId: string;
}

export const UseHighlightFunctionButtonsConnectedQuery = gql(`
  query UseHighlightFunctionButtonsConnected($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      hue
    } 
  }
`);

export const useHighlightFunctionButtonsConnected = ({
  highlightId,
}: UseHighlightFunctionButtonsConnectedProps): HighlightFunctionButtonsConnectedProps => {
  const { data } = useQuery(UseHighlightFunctionButtonsConnectedQuery, {
    variables: { highlightId },
  });

  const removeHighlightLayer = useUrlAction(urlRemoveHighlightLayer);

  const [deleteHighlight] = useApiAction(apiDeleteHighlight);

  const reviewState = useHighlightReviewStateConnected({ highlightId });

  const today = IpsumDay.today();

  const upForReview = reviewState.type === "up_for_review";
  const notUpForReview = reviewState.type === "not_up_for_review";
  const daysUntilReview =
    reviewState.type === "not_up_for_review"
      ? today.numDaysUntil(reviewState.nextReviewDay)
      : 0;

  const notificationState: HighlightFunctionButtonsConnectedProps["notificationState"] =
    ((): HighlightFunctionButtonsConnectedProps["notificationState"] => {
      if (upForReview) {
        return { type: "Up for review", ease: reviewState.ease };
      } else if (reviewState.type === "reviewed") {
        return { type: "Reviewed", ease: reviewState.ease };
      } else if (notUpForReview) {
        return {
          type: "Not up for review",
          daysUntilReview,
          ease: reviewState.ease,
        };
      } else {
        return undefined;
      }
    })();

  const onDelete = () => {
    removeHighlightLayer({ highlightId });

    deleteHighlight({ id: highlightId });
  };

  return {
    highlightHue: data?.highlight?.hue,
    notificationState: notificationState,
    onDelete,
  };
};
