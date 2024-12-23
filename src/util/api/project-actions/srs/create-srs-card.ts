import { IpsumDay } from "util/dates";
import type { InMemorySRSCard } from "util/state";
import { v4 as uuidv4 } from "uuid";

import type { APIFunction } from "../types";

export const createSRSCard: APIFunction<
  {
    dayCreated?: IpsumDay;
    id?: string;
    subjectType: "Highlight";
    subject: string;
  },
  InMemorySRSCard
> = (args, context) => {
  const { projectState } = context;

  const id = args.id ?? uuidv4();

  const dayCreated = args.dayCreated ?? IpsumDay.today();

  if (!projectState.collection("highlights").has(args.subject)) {
    throw new Error(
      `No highlight with id ${args.subject} exists in the project state`
    );
  }

  if (projectState.collection("highlights").get(args.subject).srsCard) {
    throw new Error(
      `Highlight with id ${args.subject} already has an associated srsCard`
    );
  }

  const srsCard = projectState.collection("srsCards").create(id, {
    __typename: "SRSCard",
    id,
    history: {
      __typename: "History",
      dateCreated: dayCreated.toString("iso"),
    },
    subjectType: args.subjectType,
    subject: args.subject,
    reviews: [],
  });

  projectState.collection("highlights").mutate(args.subject, () => ({
    srsCard: id,
  }));

  return srsCard;
};
