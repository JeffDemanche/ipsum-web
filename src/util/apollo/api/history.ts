import { IpsumDateTime, IpsumDay } from "util/dates";

import { UnhydratedType } from "../client";

export const initializeHistory = ({
  dateCreated,
}: {
  dateCreated?: IpsumDay;
}): UnhydratedType["History"] => {
  return {
    __typename: "History",
    dateCreated: (dateCreated ?? IpsumDateTime.today()).toString("iso"),
  };
};
