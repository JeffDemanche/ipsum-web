import { idbWrapper } from "util/indexed-db";
import { PROJECT_STATE } from "util/state";

export const autosave = () => {
  if (PROJECT_STATE) {
    idbWrapper?.putAutosaveValue(PROJECT_STATE.toSerialized());
  }
};
