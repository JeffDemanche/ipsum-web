import { IpsumDateTime } from "util/dates";
import { UnhydratedType } from "../client";

export const initializeHistory = (): UnhydratedType["History"] => {
  return {
    __typename: "History",
    dateCreated: IpsumDateTime.today().toString("iso"),
  };
};
