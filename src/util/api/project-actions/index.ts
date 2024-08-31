import { autosave } from "util/serializer";
import { PROJECT_STATE } from "util/state";

import { APIFunction } from "./types";

export const useApiAction = <T, U>(f: APIFunction<T, U>) => {
  const projectState = PROJECT_STATE;

  return [
    (args: T, options?: { autosave?: boolean }) => {
      const result = f(args, { projectState });

      if (options?.autosave) {
        autosave();
      }

      return result;
    },
  ];
};

export { createEntry as apiCreateEntry } from "./entry/create-entry";

export { createJournalEntry as apiCreateJournalEntry } from "./entry/create-journal-entry";

export { createHighlight as apiCreateHighlight } from "./highlight/create-highlight";
export { createRelationFromHighlight as apiCreateRelationFromHighlight } from "./highlight/create-relation-from-highlight";

export { createCommentEntry as apiCreateCommentEntry } from "./comment/create-comment-entry";

export { createComment as apiCreateComment } from "./comment/create-comment";

export { createArc as apiCreateArc } from "./arc/create-arc";

export { updateJournalTitle as apiUpdateJournalTitle } from "./journal/update-journal-title";
