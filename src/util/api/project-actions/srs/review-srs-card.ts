import { IpsumDay } from "util/dates";
import { IpsumSRSCard } from "util/repetition";
import { InMemorySRSCard } from "util/state";

import { updateDay } from "../day/update-day";
import { APIFunction } from "../types";

export const reviewSRSCard: APIFunction<
  { id: string; day?: IpsumDay; rating: number },
  InMemorySRSCard
> = (args, context) => {
  const { projectState } = context;

  if (!projectState.collection("srsCards").has(args.id)) {
    throw new Error(
      `No srsCard with id ${args.id} exists in the project state`
    );
  }

  if (args.rating < 1 || args.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const priorReviews = projectState.collection("srsCards").get(args.id).reviews;

  const day = args.day ?? IpsumDay.today();

  const inMemoryCard = projectState.collection("srsCards").get(args.id);

  const cardBeforeReview = IpsumSRSCard.fromProjectStateCard(inMemoryCard);

  const review = cardBeforeReview.review(args.rating, day);

  const priorReviewOnDay = priorReviews.find((review) =>
    IpsumDay.fromString(review.day, "stored-day").equals(day)
  );

  projectState.collection("srsCards").mutate(args.id, (srsCard) => {
    if (priorReviewOnDay) {
      return {
        reviews: srsCard.reviews.map((review) =>
          review === priorReviewOnDay
            ? {
                ...review,
                rating: args.rating,
                easeBefore: review.easeBefore,
                easeAfter: review.easeAfter,
                intervalBefore: review.intervalBefore,
                intervalAfter: review.intervalAfter,
              }
            : review
        ),
      };
    } else {
      return {
        reviews: [
          ...srsCard.reviews,
          {
            __typename: "SRSCardReview",
            day: day.toString("stored-day"),
            rating: args.rating,
            easeBefore: review.easeBefore,
            easeAfter: review.easeAfter,
            intervalBefore: review.intervalBefore,
            intervalAfter: review.intervalAfter,
          },
        ],
      };
    }
  });

  updateDay(
    {
      day,
      srsCardsReviewed: (previous) => [...previous, args.id],
    },
    context
  );

  return projectState.collection("srsCards").get(args.id);
};
