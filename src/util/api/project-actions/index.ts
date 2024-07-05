import { useContext } from "react";
import { idbWrapper } from "util/indexed-db";
import { ProjectStateContext } from "util/state/project";

import { APIFunction } from "./types";

export const useApiAction = <T, U>(f: APIFunction<T, U>) => {
  const { state } = useContext(ProjectStateContext);

  return [
    (args: T, options?: { autosave?: boolean }) => {
      const result = f(args, { state });

      if (options?.autosave) {
        idbWrapper?.putAutosaveValue(state.toSerialized());
      }

      return result;
    },
  ];
};

export { createEntry } from "./entry/create-entry";
export { createJournalEntry } from "./entry/create-journal-entry";
