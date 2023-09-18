import { IpsumDay } from "util/dates";
import { vars } from "../client";
import { StrictTypedTypePolicies } from "../__generated__/apollo-helpers";
import {
  QuerySrsCardArgs,
  QuerySrsCardsForReviewArgs,
  QuerySrsReviewsFromDayArgs,
  SrsCardSubjectType,
} from "../__generated__/graphql";

export const SRSResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      srsCard(_, { args }: { args: Partial<QuerySrsCardArgs> }) {
        return vars.srsCards()[args.id];
      },
      srsCardsForReview(
        _,
        { args }: { args: Partial<QuerySrsCardsForReviewArgs> }
      ) {
        const deck = args?.deckId ?? "default";
        const argDay = IpsumDay.fromString(args.day);
        const today = IpsumDay.today();

        if (today.toJsDate() > argDay.toJsDate()) {
          throw new Error("srsCardsForReview: Day must be today or later");
        }

        return Object.values(vars.srsCards())
          .filter((card) => {
            if (card.deck !== deck) return false;

            const lastReviewed = IpsumDay.fromString(card.lastReviewed);

            return (
              lastReviewed.add(Math.floor(card.interval)).toJsDate() <
              argDay.toJsDate()
            );
          })
          .sort((a, b) => {
            const aVal = IpsumDay.fromString(a.lastReviewed)
              .add(a.interval)
              .toJsDate();
            const bVal = IpsumDay.fromString(b.lastReviewed)
              .add(b.interval)
              .toJsDate();

            return aVal.getTime() - bVal.getTime();
          });
      },
      srsReviewsFromDay(
        _,
        { args }: { args: Partial<QuerySrsReviewsFromDayArgs> }
      ) {
        const deck = args?.deckId ?? "default";

        if (
          IpsumDay.fromString(args.day).toJsDate() > IpsumDay.today().toJsDate()
        ) {
          throw new Error("srsReviewsFromDay: Day must be today or earlier");
        }

        const reviewIdsFromDay = vars.days()[args.day]?.srsCardReviews ?? [];
        return reviewIdsFromDay
          .map((id) => vars.srsCardReviews()[id])
          .filter((review) => {
            const cardId = review.card;
            const card = vars.srsCards()[cardId];
            return card.deck === deck;
          });
      },
    },
  },
  SRSDeck: {
    keyFields: ["id"],
    fields: {
      cards(cardIds: string[]) {
        const cards = vars.srsCards();
        return cardIds.map((id) => cards[id]);
      },
    },
  },
  SRSCard: {
    keyFields: ["id"],
    fields: {
      subject(subjectId, { readField }) {
        const subjectType = readField<SrsCardSubjectType>("subjectType");
        if (subjectType === "Highlight") {
          return vars.highlights()[subjectId];
        } else if (subjectType === "Arc") {
          return vars.arcs()[subjectId];
        }
      },
      deck(deckId: string) {
        return vars.srsDecks()[deckId];
      },
      reviews(reviewIds: string[]) {
        const reviews = vars.srsCardReviews();
        return reviewIds.map((id) => reviews[id]);
      },
    },
  },
  SRSCardReview: {
    keyFields: ["id"],
    fields: {
      card(cardId: string) {
        return vars.srsCards()[cardId];
      },
    },
  },
};
