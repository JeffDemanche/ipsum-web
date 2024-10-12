import { autosave } from "util/serializer";
import { PROJECT_STATE } from "util/state";

import { APIFunction } from "./types";

export const useApiAction = <T, U>(f: APIFunction<T, U>) => {
  const projectState = PROJECT_STATE;

  return [
    (args: T, options?: { autosave?: boolean }) => {
      const result = f(args, { projectState });

      // Autosave by default
      if (options?.autosave || options?.autosave === undefined) {
        autosave();
      }

      return result;
    },
  ];
};

export { createEntry as apiCreateEntry } from "./entry/create-entry";

export { createJournalEntry as apiCreateJournalEntry } from "./entry/create-journal-entry";
export { updateJournalEntry as apiUpdateJournalEntry } from "./entry/update-journal-entry";
export { deleteJournalEntry as apiDeleteJournalEntry } from "./entry/delete-journal-entry";
export { createArcEntry as apiCreateArcEntry } from "./entry/create-arc-entry";
export { updateArcEntry as apiUpdateArcEntry } from "./entry/update-arc-entry";
export { createCommentEntry as apiCreateCommentEntry } from "./entry/create-comment-entry";

export { createHighlight as apiCreateHighlight } from "./highlight/create-highlight";
export { createRelationFromHighlightToArc as apiCreateRelationFromHighlightToArc } from "./highlight/create-relation-from-highlight-to-arc";
export { deleteHighlight as apiDeleteHighlight } from "./highlight/delete-highlight";
export { deleteRelationFromHighlightToArc as apiDeleteRelationFromHighlightToArc } from "./highlight/delete-relation-from-highlight-to-arc";

export { createComment as apiCreateComment } from "./comment/create-comment";

export { createArc as apiCreateArc } from "./arc/create-arc";

export { updateJournalTitle as apiUpdateJournalTitle } from "./journal/update-journal-title";
