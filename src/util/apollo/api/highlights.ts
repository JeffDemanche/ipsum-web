import _ from "lodash";
import { IpsumDateTime, IpsumDay } from "util/dates";
import { v4 as uuidv4 } from "uuid";

import { autosave } from "../autosave";
import { UnhydratedType, vars } from "../client";
import { upsertDay } from "./day";

export const createHighlight = ({
  id,
  entry,
  outgoingRelations,
}: {
  id?: string;
  entry: string;
  outgoingRelations?: string[];
}): UnhydratedType["Highlight"] => {
  const highlightId = id ?? uuidv4();

  const result: UnhydratedType["Highlight"] = {
    __typename: "Highlight",
    id: highlightId,
    entry,
    outgoingRelations: outgoingRelations ?? [],
    history: {
      __typename: "History",
      dateCreated: IpsumDateTime.today().toString("iso"),
    },
    importanceRatings: [],
    comments: [],
  };
  vars.highlights({
    ...vars.highlights(),
    [highlightId]: { __typename: "Highlight", id: highlightId, ...result },
  });
  autosave();
  return result;
};

export const updateHighlight = (
  highlight: Partial<UnhydratedType["Highlight"]>
) => {
  if (!highlight.id)
    throw new Error("updateHighlight: highlight.id is required");

  if (!vars.highlights()[highlight.id]) return;

  const newHighlights = { ...vars.highlights() };
  newHighlights[highlight.id] = {
    ...newHighlights[highlight.id],
    ...highlight,
  };
  vars.highlights(newHighlights);
  autosave();
};

export const deleteHighlight = (id: string) => {
  if (!vars.highlights()[id]) return;

  const highlight = vars.highlights()[id];

  const newRelations = { ...vars.relations() };
  highlight.outgoingRelations.forEach((relation) => {
    delete newRelations[relation];
  });
  vars.relations(newRelations);

  const newHighlights = { ...vars.highlights() };
  delete newHighlights[id];
  vars.highlights(newHighlights);
  autosave();
};

/**
 * Serves as both "add importance rating" when rating is not 0, and "remove
 * importance rating" when rating is 0. Will default to today's date if no day
 * is provided.
 */
export const rateHighlightImportance = ({
  highlightId,
  day,
  rating,
}: {
  highlightId: string;
  day?: IpsumDay;
  rating: number;
}) => {
  const highlight = vars.highlights()[highlightId];
  if (!highlight) return;

  day = day ?? IpsumDay.today();

  if (rating > 1 || rating < 0) {
    throw new Error("rateHighlightImportance: Rating must be between 0 and 1");
  }

  const newHighlight = _.cloneDeep(highlight);
  const dayObj = vars.days()[day.toString("stored-day")];

  if (rating === 0) {
    // Remove ImportanceRating object.
    newHighlight.importanceRatings = newHighlight.importanceRatings.filter(
      (r) => {
        return r.day !== day.toString("stored-day");
      }
    );
    vars.highlights({ ...vars.highlights(), [highlightId]: newHighlight });

    // Update day object.
    if (dayObj) {
      const newRatedhighlights = dayObj.ratedHighlights.filter(
        (highlight) => highlightId !== highlight
      );
      upsertDay({
        day: day.toString("stored-day"),
        ratedHighlights: newRatedhighlights,
      });
    } else {
      upsertDay({
        day: day.toString("stored-day"),
        ratedHighlights: [newHighlight.id],
      });
    }
  } else {
    // Push ImportanceRating.
    newHighlight.importanceRatings.push({
      __typename: "ImportanceRating",
      day:
        day?.toString("stored-day") ?? IpsumDay.today().toString("stored-day"),
      value: rating,
    });
    vars.highlights({ ...vars.highlights(), [highlightId]: newHighlight });

    // Update day object.
    if (dayObj) {
      const newRatedhighlights = [...dayObj.ratedHighlights, highlightId];
      upsertDay({
        day: day.toString("stored-day"),
        ratedHighlights: newRatedhighlights,
      });
    } else {
      upsertDay({
        day: day.toString("stored-day"),
        ratedHighlights: [newHighlight.id],
      });
    }
  }

  autosave();
};
