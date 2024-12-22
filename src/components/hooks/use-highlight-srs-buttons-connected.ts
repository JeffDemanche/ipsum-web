import { useQuery } from "@apollo/client";
import type { HighlightSRSButtons } from "components/molecules/HighlightSRSButtons";
import type React from "react";
import { apiCreateSRSCard, apiReviewSRSCard, useApiAction } from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";

import { useHighlightReviewStateConnected } from "./use-highlight-review-state";

export type HighlightSRSButtonsConnectedProps = Pick<
  React.ComponentProps<typeof HighlightSRSButtons>,
  "today" | "onRate" | "onStartSRS" | "prospectiveIntervals" | "reviewState"
>;

interface UseHighlightSRSButtonsConnectedProps {
  highlightId: string;
}

const UseHighlightSRSButtonsConnectedQuery = gql(`
  query UseHighlightSRSButtonsConnected($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      srsCard  {
        id
        prospectiveIntervals(day: null)
      }
    }
  }  
`);

export const useHighlightSRSButtonsConnected = ({
  highlightId,
}: UseHighlightSRSButtonsConnectedProps): HighlightSRSButtonsConnectedProps => {
  const { data } = useQuery(UseHighlightSRSButtonsConnectedQuery, {
    variables: { highlightId },
  });

  const [createSRSCard] = useApiAction(apiCreateSRSCard);

  const [reviewSRSCard] = useApiAction(apiReviewSRSCard);

  const srsCard = data?.highlight.srsCard;

  const onStartSRS = () => {
    createSRSCard({ subject: highlightId, subjectType: "Highlight" });
  };

  const onRate = (q: number) => {
    srsCard &&
      reviewSRSCard({
        id: srsCard.id,
        rating: q,
      });
  };

  const reviewState = useHighlightReviewStateConnected({ highlightId });

  return {
    today: IpsumDay.today(),
    onRate,
    onStartSRS,
    prospectiveIntervals: srsCard?.prospectiveIntervals,
    reviewState,
  };
};
