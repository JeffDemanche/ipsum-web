import { vars } from "../client";
import { StrictTypedTypePolicies } from "../__generated__/apollo-helpers";

export const DayResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      day(_, { args }) {
        if (!args?.day) {
          return null;
        }
        return vars.days()[args.day] ?? null;
      },
    },
  },
  Day: {
    keyFields: ["day"],
  },
};
