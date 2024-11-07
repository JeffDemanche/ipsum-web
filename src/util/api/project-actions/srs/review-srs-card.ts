import { IpsumDay } from "util/dates";
import { InMemorySRSCard } from "util/state";

import { updateDay } from "../day/update-day";
import { APIFunction } from "../types";

export const reviewSRSCard: APIFunction<
  { id: string; day: IpsumDay; rating: number },
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

  projectState.collection("srsCards").mutate(args.id, (srsCard) => {
    return {
      reviews: [
        ...srsCard.reviews,
        {
          __typename: "SRSCardReview",
          day: args.day.toString("stored-day"),
          rating: args.rating,
        },
      ],
    };
  });

  updateDay(
    {
      day: args.day,
      srsCardsReviewed: (previous) => [...previous, args.id],
    },
    context
  );

  return projectState.collection("srsCards").get(args.id);
};
