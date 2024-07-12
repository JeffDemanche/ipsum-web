import { QueryHighlightsArgs, StrictTypedTypePolicies } from "util/apollo";
import { IpsumTimeMachine } from "util/diff";
import { excerptDivString } from "util/excerpt";
import { highlightImportanceOnDay } from "util/importance";
import {
  InMemoryHighlight,
  InMemoryImportanceRating,
  PROJECT_STATE,
} from "util/state";

export const HighlightResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      highlight(_, { args }) {
        if (!args?.id) {
          return null;
        }
        return PROJECT_STATE.collection("highlights").get(args.id) ?? null;
      },
      highlights(_, { args }: { args?: QueryHighlightsArgs }) {
        let results: InMemoryHighlight[] = [];

        if (args?.ids && !args?.entries) {
          results = args.ids.map((id) =>
            PROJECT_STATE.collection("highlights").get(id)
          );
        } else if (args?.ids || args?.entries || args?.arcs) {
          results = Object.values(
            PROJECT_STATE.collection("highlights").getAll()
          ).filter((highlight) => {
            const highlightRelations = highlight.outgoingRelations
              .map((relation) =>
                PROJECT_STATE.collection("relations").get(relation)
              )
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
          results = Object.values(
            PROJECT_STATE.collection("highlights").getAll()
          );
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
          ? PROJECT_STATE.collection("arcs").get(outgoingRelations[0]?.object)
          : null;
      },
      arcs(_, { readField }) {
        const outgoingRelations =
          readField<{ __typename: "Relation"; object: string }[]>(
            "outgoingRelations"
          );
        return outgoingRelations
          .map((relation) =>
            PROJECT_STATE.collection("arcs").get(relation?.object)
          )
          .filter(Boolean);
      },
      entry(entryKey) {
        return PROJECT_STATE.collection("entries").get(entryKey);
      },
      outgoingRelations(relationIds: string[]) {
        return relationIds.map((id) =>
          PROJECT_STATE.collection("relations").get(id)
        );
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
          readField<InMemoryImportanceRating[]>("importanceRatings");

        return highlightImportanceOnDay({ ratings });
      },
      comments(commentIds: string[]) {
        const comments = PROJECT_STATE.collection("comments").getAll();
        return commentIds.map((id) => comments[id]);
      },
    },
  },
  ImportanceRating: {
    keyFields: ["day"],
    fields: {
      day(day) {
        return PROJECT_STATE.collection("days").get(day);
      },
    },
  },
};