import { UnhydratedType } from "../client";

export const initializeHistory = (): UnhydratedType["History"] => {
  return {
    __typename: "History",
    dateCreated: new Date().toISOString(),
  };
};
