import { useContext } from "react";
import { idbWrapper } from "util/indexed-db";
import { IpsumStateContext } from "util/state";

import { APIFunction } from "./types";

export const useApiAction = <T, U>(f: APIFunction<T, U>) => {
  const { projectState } = useContext(IpsumStateContext);

  return [
    (args: T, options?: { autosave?: boolean }) => {
      const result = f(args, { projectState });

      if (options?.autosave) {
        idbWrapper?.putAutosaveValue(projectState.toSerialized());
      }

      return result;
    },
  ];
};

export { createEntry as apiCreateEntry } from "./entry/create-entry";

export { createJournalEntry as apiCreateJournalEntry } from "./entry/create-journal-entry";

export { createHighlight as apiCreateHighlight } from "./highlight/create-highlight";

export { createCommentEntry as apiCreateCommentEntry } from "./comment/create-comment-entry";

export { createComment as apiCreateComment } from "./comment/create-comment";
