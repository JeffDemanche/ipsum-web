import { History, StrictTypedTypePolicies } from "util/apollo";
import { IpsumDay } from "util/dates";
import { IpsumSRSCard } from "util/repetition";
import { InMemorySRSCardReview, PROJECT_STATE } from "util/state";

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
      upForReview(_, { readField }) {
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

        return card.upForReview();
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
