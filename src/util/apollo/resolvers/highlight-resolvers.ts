import { IpsumTimeMachine } from "util/diff";
import { excerptDivString } from "util/excerpt";
import { highlightImportanceOnDay } from "util/importance";

import { StrictTypedTypePolicies } from "../__generated__/apollo-helpers";
import { QueryHighlightsArgs } from "../__generated__/graphql";
import { UnhydratedType, vars } from "../client";

export const HighlightResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      highlight(_, { args }) {
        if (!args?.id) {
          return null;
        }
        return vars.highlights()[args.id] ?? null;
      },
      highlights(_, { args }: { args?: QueryHighlightsArgs }) {
        let results: UnhydratedType["Highlight"][] = [];

        if (args?.ids && !args?.entries) {
          results = args.ids.map((id) => vars.highlights()[id]);
        } else if (args?.ids || args?.entries || args?.arcs) {
          results = Object.values(vars.highlights()).filter((highlight) => {
            const highlightRelations = highlight.outgoingRelations
              .map((relation) => vars.relations()[relation])
              .filter((relation) => relation.objectType === "Arc");
            const arcsIntersection = highlightRelations.filter((relation) =>
              args.arcs?.includes(relation.object)
            );
            return (
              (!args.ids || args.ids.includes(highlight.id)) &&
              (!args.entries || args.entries.includes(highlight.entry)) &&
              (!args.arcs || arcsIntersection.length > 0)
            );
          });
        } else {
          results = Object.values(vars.highlights());
        }

        if (args?.sort === "DATE_DESC") {
          results.sort(
            (a, b) =>
              Date.parse(b.history.dateCreated) -
              Date.parse(a.history.dateCreated)
          );
        } else if (args?.sort === "IMPORTANCE_DESC") {
          results.sort((a, b) => {
            const aImportance = highlightImportanceOnDay({
              ratings: a.importanceRatings,
            });
            const bImportance = highlightImportanceOnDay({
              ratings: b.importanceRatings,
            });
            return bImportance - aImportance;
          });
        }
        return results;
      },
    },
  },
  Highlight: {
    keyFields: ["id"],
    fields: {
      arc(_, { readField }) {
        const outgoingRelations =
          readField<{ __typename: "Relation"; object: string }[]>(
            "outgoingRelations"
          );
        return outgoingRelations.length
          ? vars.arcs()[outgoingRelations[0].object]
          : null;
      },
      arcs(_, { readField }) {
        const outgoingRelations =
          readField<{ __typename: "Relation"; object: string }[]>(
            "outgoingRelations"
          );
        return outgoingRelations
          .map((relation) => vars.arcs()[relation?.object])
          .filter(Boolean);
      },
      entry(entryKey) {
        return vars.entries()[entryKey];
      },
      outgoingRelations(relationIds: string[]) {
        return relationIds.map((id) => vars.relations()[id]);
      },
      hue(_, { readField }) {
        const arcs = readField<
          {
            __typename: "Arc";
            id: string;
            color: number;
          }[]
        >("arcs");
        const averageHue =
          arcs.reduce((acc, cur) => acc + cur.color, 0) / arcs.length;
        return Math.floor(averageHue);
      },
      excerpt(_, { readField }) {
        const entry = readField<{
          __typename: "Entry";
          trackedHTMLString: string;
        }>("entry");

        const currentHtmlString = IpsumTimeMachine.fromString(
          entry.trackedHTMLString
        ).currentValue;

        return excerptDivString({
          entryDomString: currentHtmlString,
          highlightId: readField("id"),
          highlightHue: readField("hue"),
        });
      },
      currentImportance(_, { readField }) {
        const ratings =
          readField<UnhydratedType["ImportanceRating"][]>("importanceRatings");

        return highlightImportanceOnDay({ ratings });
      },
      comments(commentIds: string[]) {
        const comments = vars.comments();
        return commentIds.map((id) => comments[id]);
      },
    },
  },
  ImportanceRating: {
    keyFields: ["day"],
    fields: {
      day(day) {
        return vars.days()[day];
      },
    },
  },
};
