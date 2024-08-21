import { IpsumURLSearch } from "util/state";

import { URLFunction } from "./types";

export const overwriteJournalUrl: URLFunction<
  IpsumURLSearch<"journal">,
  "journal"
> = (props) => {
  return props;
};
