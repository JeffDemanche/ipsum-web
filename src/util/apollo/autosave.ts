import { idbWrapper } from "util/indexed-db";

import { writeApolloState } from "./serializer";

export const autosave = () => {
  idbWrapper.putAutosaveValue(writeApolloState());
};
