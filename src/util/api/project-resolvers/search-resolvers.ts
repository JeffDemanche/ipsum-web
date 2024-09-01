import {
  QuerySearchHighlightsArgs,
  StrictTypedTypePolicies,
} from "util/apollo";
import { IpsumDay } from "util/dates";
import { InMemoryHighlight, PROJECT_STATE } from "util/state";

const highlightMatchesDays = (highlight: InMemoryHighlight, days: string[]) => {
  if (!highlight) return false;

  const entry = PROJECT_STATE.collection("entries").get(highlight.entry);

  const highlightEntryDay =
    entry && IpsumDay.fromString(entry.history.dateCreated, "iso");

  if (!highlightEntryDay) return false;

  return days.some((day) => highlightEntryDay.toString("url-format") === day);
};

const highlightMatchesArc = (highlight: InMemoryHighlight, arcId: string) => {
  if (!highlight) return false;

  return highlight.outgoingRelations.some((relation) => {
    const relationObj = PROJECT_STATE.collection("relations").get(relation);
    if (!relationObj) return false;

    return (
      relationObj.objectType === "Arc" &&
      relationObj.subjectType === "Highlight" &&
      relationObj.object === arcId
    );
  });
};

const highlightMatchesHighlight = (
  highlightNeedle: InMemoryHighlight,
  highlightIdInHaystack: string
) => {
  if (!highlightNeedle) return false;

  if (highlightNeedle.id === highlightIdInHaystack) return true;

  const arcsRelatedToByHighlightNeedle = highlightNeedle.outgoingRelations
    .filter((relation) => {
      const relationObj = PROJECT_STATE.collection("relations").get(relation);
      if (!relationObj) return false;

      return (
        relationObj.objectType === "Arc" &&
        relationObj.subjectType === "Highlight"
      );
    })
    .map(
      (relation) => PROJECT_STATE.collection("relations").get(relation).object
    );

  const highlightInHaystack = PROJECT_STATE.collection("highlights").get(
    highlightIdInHaystack
  );
  return highlightInHaystack?.outgoingRelations.some((relation) => {
    const relationObj = PROJECT_STATE.collection("relations").get(relation);
    if (!relationObj) return false;

    if (
      relationObj.objectType === "Arc" &&
      arcsRelatedToByHighlightNeedle.includes(relationObj.object)
    ) {
      return arcsRelatedToByHighlightNeedle.includes(relationObj.object);
    }
  });
};

export const SearchResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      searchHighlights(_, { args }) {
        const typedArgs = args as QuerySearchHighlightsArgs;
        const allHighlights = Object.values(
          PROJECT_STATE.collection("highlights").getAll()
        );
        const filteredHighlights = allHighlights.filter((highlight) => {
          // Filter out "stranded" highlights
          if (!PROJECT_STATE.collection("entries").has(highlight.entry)) {
            return false;
          }

          let allAndsMatch = true;
          typedArgs.criteria.and?.forEach((ors) => {
            let someClauseMatches = false;
            ors.or.forEach((expression) => {
              if (expression.days) {
                someClauseMatches =
                  someClauseMatches ||
                  highlightMatchesDays(highlight, expression.days.days);
              }

              if (expression.relatesToArc) {
                someClauseMatches =
                  someClauseMatches ||
                  highlightMatchesArc(highlight, expression.relatesToArc.arcId);
              }
            });
            if (!someClauseMatches) allAndsMatch = false;
          });
          return allAndsMatch;
        });
        return filteredHighlights;
      },
    },
  },
};
