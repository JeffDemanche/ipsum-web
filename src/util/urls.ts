import { IpsumDateTime } from "./dates";

export const entryUrl = (entryDate: IpsumDateTime) =>
  `/journal/${entryDate.toString("url-format")}`;
