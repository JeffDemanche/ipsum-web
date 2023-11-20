import { vars } from "../client";
import { StrictTypedTypePolicies } from "../__generated__/apollo-helpers";
import { QueryHighlightsArgs } from "../__generated__/graphql";

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
        if (args?.ids && !args?.entries) {
          return args.ids.map((id) => vars.highlights()[id]);
        } else if (args?.ids || args?.entries || args?.arcs) {
          return Object.values(vars.highlights()).filter((highlight) => {
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
        }
        return Object.values(vars.highlights());
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
      srsCards(_, { readField }) {
        return Object.values(vars.srsCards()).filter(
          (srsCard) => srsCard.subject === readField("id")
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
    },
  },
};
