import { UnhydratedType, vars } from "../client";
import { v4 as uuidv4 } from "uuid";
import { autosave } from "../autosave";
import { calculateNextInterval } from "util/srs";
import { IpsumDateTime, IpsumDay } from "util/dates";

export const createSRSCard = ({
  subjectType,
  subjectId,
}: {
  subjectType: "Arc" | "Highlight";
  subjectId: string;
}): UnhydratedType["SRSCard"] => {
  const srsCardId = uuidv4();

  if (subjectType === "Arc" && !vars.arcs()[subjectId])
    throw new Error("createSRSCard: Subject arc not found");

  if (subjectType === "Highlight" && !vars.highlights()[subjectId])
    throw new Error("createSRSCard: Subject highlight not found");

  const result: UnhydratedType["SRSCard"] = {
    __typename: "SRSCard",
    id: srsCardId,
    deck: "default",
    ef: 2.5,
    interval: 1,
    reviews: [],
    subjectType,
    subject: subjectId,
    lastReviewed: IpsumDay.today().toString(),
    history: {
      __typename: "History",
      dateCreated: IpsumDateTime.today().toString("iso"),
    },
  };

  vars.srsCards({ ...vars.srsCards(), [srsCardId]: result });

  autosave();
  return result;
};

export const reviewSRSCard = ({
  cardId,
  rating,
}: {
  cardId: string;
  rating: number;
}): {
  srsCard: UnhydratedType["SRSCard"];
  srsCardReview: UnhydratedType["SRSCardReview"];
} => {
  if (!vars.srsCards()[cardId])
    throw new Error("reviewSRSCard: Card not found");

  if (rating < 0 || rating > 5)
    throw new Error("reviewSRSCard: Rating must be between 0 and 5");

  const card = vars.srsCards()[cardId];

  const dayKey = IpsumDay.today().toString();

  const hydratedCardReviews = card.reviews.map(
    (reviewId) => vars.srsCardReviews()[reviewId]
  );

  const cardAlreadyReviewedToday = hydratedCardReviews
    .map((review) => review.day)
    .includes(dayKey);

  if (cardAlreadyReviewedToday) {
    // Update review rather than creating
    const existingReview = hydratedCardReviews.find(
      (review) => review.day === dayKey
    );

    const newCardValues = calculateNextInterval(
      existingReview.beforeInterval,
      existingReview.beforeEF,
      rating
    );

    const updatedCardReview: UnhydratedType["SRSCardReview"] = {
      ...existingReview,
      rating,
      afterEF: newCardValues.nextEF,
      afterInterval: newCardValues.nextInterval,
    };

    vars.srsCardReviews({
      ...vars.srsCardReviews(),
      [existingReview.id]: updatedCardReview,
    });

    const updatedCard: UnhydratedType["SRSCard"] = {
      ...card,
      interval: newCardValues.nextInterval,
      ef: newCardValues.nextEF,
    };

    vars.srsCards({ ...vars.srsCards(), [cardId]: updatedCard });
    autosave();

    return {
      srsCard: updatedCard,
      srsCardReview: updatedCardReview,
    };
  } else {
    // Create review
    const newCardValues = calculateNextInterval(card.interval, card.ef, rating);

    const cardReviewId = uuidv4();

    const newCardReview: UnhydratedType["SRSCardReview"] = {
      __typename: "SRSCardReview",
      id: cardReviewId,
      rating,
      beforeEF: card.ef,
      beforeInterval: card.interval,
      afterEF: newCardValues.nextEF,
      afterInterval: newCardValues.nextInterval,
      day: IpsumDay.today().toString(),
      card: cardId,
    };

    vars.srsCardReviews({
      ...vars.srsCardReviews(),
      [cardReviewId]: newCardReview,
    });

    // Add review to day object
    if (!vars.days()[dayKey]?.srsCardReviews?.includes(cardReviewId)) {
      vars.days({
        ...vars.days(),
        [dayKey]: {
          ...vars.days()[dayKey],
          srsCardReviews: [
            ...(vars.days()[dayKey]?.srsCardReviews ?? []),
            cardReviewId,
          ],
        },
      });
    }

    const newCard: UnhydratedType["SRSCard"] = {
      ...card,
      interval: newCardValues.nextInterval,
      ef: newCardValues.nextEF,
      reviews: [...card.reviews, cardReviewId],
    };

    vars.srsCards({ ...vars.srsCards(), [cardId]: newCard });

    autosave();
    return {
      srsCard: newCard,
      srsCardReview: newCardReview,
    };
  }
};

export const deleteSRSCard = ({ cardId }: { cardId: string }) => {
  if (!vars.srsCards()[cardId]) return;

  const newCards = { ...vars.srsCards() };
  delete newCards[cardId];
  vars.srsCards(newCards);
  autosave();
};