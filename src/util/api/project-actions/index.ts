import { autosave } from "util/serializer";
import { PROJECT_STATE } from "util/state";

import type { APIFunction } from "./types";

export const useApiAction = <T, U>(f: APIFunction<T, U>) => {
  const projectState = PROJECT_STATE;

  return [
    (args: T, options?: { autosave?: boolean }) => {
      try {
        const result = f(args, { projectState });

        // Autosave by default
        if (options?.autosave || options?.autosave === undefined) {
          autosave();
        }

        return result;
      } catch (e) {
        console.error(e);
        return null;
      }
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
export { updateCommentEntry as apiUpdateCommentEntry } from "./entry/update-comment-entry";
export { deleteCommentEntry as apiDeleteCommentEntry } from "./entry/delete-comment-entry";

export { createHighlight as apiCreateHighlight } from "./highlight/create-highlight";
export { createRelationFromHighlightToArc as apiCreateRelationFromHighlightToArc } from "./relation/create-relation-from-highlight-to-arc";
export { createRelationFromArcToArc as apiCreateRelationFromArcToArc } from "./relation/create-relation-from-arc-to-arc";
export { createRelationFromCommentToHighlight as apiCreateRelationFromCommentToHighlight } from "./relation/create-relation-from-comment-to-highlight";

export { deleteHighlight as apiDeleteHighlight } from "./highlight/delete-highlight";
export { deleteRelationFromHighlightToArc as apiDeleteRelationFromHighlightToArc } from "./relation/delete-relation-from-highlight-to-arc";
export { deleteRelationFromArcToArc as apiDeleteRelationFromArcToArc } from "./relation/delete-relation-from-arc-to-arc";

export { createComment as apiCreateComment } from "./comment/create-comment";
export { deleteComment as apiDeleteComment } from "./comment/delete-comment";

export { createArc as apiCreateArc } from "./arc/create-arc";

export { updateJournalTitle as apiUpdateJournalTitle } from "./journal/update-journal-title";

export { createSRSCard as apiCreateSRSCard } from "./srs/create-srs-card";
export { reviewSRSCard as apiReviewSRSCard } from "./srs/review-srs-card";
