import type { History, StrictTypedTypePolicies } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumSRSCard } from "util/repetition";
import type { InMemorySRSCardReview} from "util/state";
import { PROJECT_STATE } from "util/state";

export const SRSResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      srsCard(_, { args }: { args: { id?: string } }) {
        if (args?.id) {
          return PROJECT_STATE.collection("srsCards").get(args.id) ?? null;
        }
        return null;
      },
      srsCards(_, { args }: { args: { ids?: string[] } }) {
        if (args?.ids) {
          return args.ids.map((id) =>
            PROJECT_STATE.collection("srsCards").get(id)
          );
        }
        return Object.values(PROJECT_STATE.collection("srsCards").getAll());
      },
    },
  },
  SRSCard: {
    fields: {
      upForReview(_, { readField, args }) {
        const history = readField<History>("history");
        const reviews = readField<InMemorySRSCardReview[]>("reviews");

        const card = new IpsumSRSCard({
          creationDay: IpsumDay.fromString(history.dateCreated, "iso"),
          ratings: reviews.map((review) => ({
            ...review,
            day: IpsumDay.fromString(review.day, "stored-day"),
            q: review.rating,
          })),
        });

        const day = args?.day
          ? IpsumDay.fromString(args.day, "stored-day")
          : undefined;

        return card.upForReview(day);
      },
      ease(_, { readField, args }) {
        const history = readField<History>("history");
        const reviews = readField<InMemorySRSCardReview[]>("reviews");

        const card = new IpsumSRSCard({
          creationDay: IpsumDay.fromString(history.dateCreated, "iso"),
          ratings: reviews.map((review) => ({
            ...review,
            day: IpsumDay.fromString(review.day, "stored-day"),
            q: review.rating,
          })),
        });

        const day = args?.day
          ? IpsumDay.fromString(args.day, "stored-day")
          : undefined;

        return card.easeOnDay(day);
      },
      interval(_, { readField, args }) {
        const history = readField<History>("history");
        const reviews = readField<InMemorySRSCardReview[]>("reviews");

        const card = new IpsumSRSCard({
          creationDay: IpsumDay.fromString(history.dateCreated, "iso"),
          ratings: reviews.map((review) => ({
            ...review,
            day: IpsumDay.fromString(review.day, "stored-day"),
            q: review.rating,
          })),
        });

        const day = args?.day
          ? IpsumDay.fromString(args.day, "stored-day")
          : undefined;

        return card.intervalOnDay(day);
      },
      prospectiveIntervals(_, { readField, args }) {
        const history = readField<History>("history");
        const reviews = readField<InMemorySRSCardReview[]>("reviews");

        const day = args?.day
          ? IpsumDay.fromString(args.day, "stored-day")
          : IpsumDay.today();

        const card = new IpsumSRSCard({
          creationDay: IpsumDay.fromString(history.dateCreated, "iso"),
          ratings: reviews
            .map((review) =>
              review.day !== day.toString("stored-day")
                ? {
                    ...review,
                    day: IpsumDay.fromString(review.day, "stored-day"),
                    q: review.rating,
                  }
                : undefined
            )
            .filter(Boolean),
        });

        if (!card.upForReview(day)) {
          return null;
        }

        const prospectiveCardReviews = [0, 1, 2, 3, 4, 5].map(
          (rating) => card.review(rating, day).intervalAfter
        );

        return prospectiveCardReviews;
      },
    },
  },
  SRSCardReview: {
    keyFields: ["day"],
    fields: {
      day(dayString) {
        // Day is stored in "stored-day" format
        return PROJECT_STATE.collection("days").get(dayString);
      },
    },
  },
};
