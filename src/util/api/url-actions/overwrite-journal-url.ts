import type { IpsumURLSearch } from "util/state";

import type { URLFunction } from "./types";

export const overwriteJournalUrl: URLFunction<
  IpsumURLSearch<"journal">,
  "journal"
> = (props) => {
  return props;
};
