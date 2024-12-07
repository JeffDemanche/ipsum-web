import { useQuery } from "@apollo/client";
import { HighlightSRSButtonsReviewState } from "components/molecules/HighlightSRSButtons";
import { useMemo } from "react";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumSRSCard } from "util/repetition";

export type ReviewStateConnectedProps = HighlightSRSButtonsReviewState;

interface UseHighlightReviewStateConnectedProps {
  highlightId: string;
}

const UseHighlightReviewStateConnectedQuery = gql(`
  query UseHighlightReviewStateConnected($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      srsCard  {
        id
        upForReview
        history {
          dateCreated
        }
        ease
        reviews {
          day {
            day
          }
          rating
          easeBefore
          easeAfter
          intervalBefore
          intervalAfter
        }
        prospectiveIntervals(day: null)
      }
    }
  }  
`);

export const useHighlightReviewStateConnected = ({
  highlightId,
}: UseHighlightReviewStateConnectedProps): ReviewStateConnectedProps => {
  const { data } = useQuery(UseHighlightReviewStateConnectedQuery, {
    variables: { highlightId },
  });

  const srsCard = data?.highlight.srsCard;

  const card = useMemo(
    () =>
      srsCard
        ? new IpsumSRSCard({
            creationDay: IpsumDay.fromString(
              srsCard.history.dateCreated,
              "iso"
            ),
            ratings: srsCard.reviews.map((review) => ({
              ...review,
              day: IpsumDay.fromString(review.day.day, "stored-day"),
              q: review.rating,
            })),
          })
        : null,
    [srsCard]
  );

  const ratedToday = card?.ratedOnDay(IpsumDay.today());

  const reviewState: ReviewStateConnectedProps = (() => {
    if (!card) {
      return { type: "none" };
    } else if (ratedToday) {
      return {
        type: "reviewed",
        rating: card?.lastRating?.q ?? 0,
        ease: card?.lastRating?.easeAfter ?? 0,
      };
    } else if (card?.upForReview()) {
      return { type: "up_for_review", ease: card?.lastRating?.easeAfter ?? 0 };
    } else {
      return {
        type: "not_up_for_review",
        nextReviewDay: card.nextReviewDay(),
        ease: card?.lastRating?.easeAfter ?? 0,
      };
    }
  })();

  return reviewState;
};
