import { useContext } from "react";
import { idbWrapper } from "util/indexed-db";
import { ProjectStateContext } from "util/state/project";

import { APIFunction } from "./types";

export const useApiAction = <T, U>(f: APIFunction<T, U>) => {
  const { state } = useContext(ProjectStateContext);

  return [
    (args: T, options?: { autosave?: boolean }) => {
      const result = f(args, { projectState: state });

      if (options?.autosave) {
        idbWrapper?.putAutosaveValue(state.toSerialized());
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
