import { IpsumDay } from "util/dates";
import { UnhydratedType, vars } from "../client";
import { StrictTypedTypePolicies } from "../__generated__/apollo-helpers";
import { QuerySearchHighlightsArgs } from "../__generated__/graphql";

const highlightMatchesDays = (
  highlight: UnhydratedType["Highlight"],
  days: string[]
) => {
  if (!highlight) return false;

  const entry = vars.entries()[highlight.entry];

  const highlightEntryDay =
    entry && IpsumDay.fromString(entry.history.dateCreated, "iso");

  if (!highlightEntryDay) return false;

  return days.some((day) => highlightEntryDay.toString("url-format") === day);
};

const highlightMatchesArc = (
  highlight: UnhydratedType["Highlight"],
  arcId: string
) => {
  if (!highlight) return false;

  return highlight.outgoingRelations.some((relation) => {
    const relationObj = vars.relations()[relation];
    if (!relationObj) return false;

    return (
      relationObj.objectType === "Arc" &&
      relationObj.subjectType === "Highlight" &&
      relationObj.object === arcId
    );
  });
};

const highlightMatchesHighlight = (
  highlightNeedle: UnhydratedType["Highlight"],
  highlightIdInHaystack: string
) => {
  if (!highlightNeedle) return false;

  if (highlightNeedle.id === highlightIdInHaystack) return true;

  const arcsRelatedToByHighlightNeedle = highlightNeedle.outgoingRelations
    .filter((relation) => {
      const relationObj = vars.relations()[relation];
      if (!relationObj) return false;

      return (
        relationObj.objectType === "Arc" &&
        relationObj.subjectType === "Highlight"
      );
    })
    .map((relation) => vars.relations()[relation].object);

  const highlightInHaystack = vars.highlights()[highlightIdInHaystack];
  return highlightInHaystack?.outgoingRelations.some((relation) => {
    const relationObj = vars.relations()[relation];
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

        const allHighlights = Object.values(vars.highlights());
        const filteredHighlights = allHighlights.filter((highlight) => {
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

              if (expression.relatesToHighlight) {
                someClauseMatches =
                  someClauseMatches ||
                  highlightMatchesHighlight(
                    highlight,
                    expression.relatesToHighlight.highlightId
                  );
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
