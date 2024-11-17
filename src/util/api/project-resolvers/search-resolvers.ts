import { StrictTypedTypePolicies } from "util/apollo";
import { IpsumDay } from "util/dates";
import {
  createFilteringProgram,
  FilterableHighlight,
  FilterableOutgoingRelation,
} from "util/filtering";
import { IpsumSRSCard } from "util/repetition";
import { PROJECT_STATE } from "util/state";

export const SearchResolvers: StrictTypedTypePolicies = {
  Query: {
    fields: {
      searchHighlights(_, { args }) {
        const program = createFilteringProgram("v1").setProgram(args.program);

        const filterableHighlights = Object.values(
          PROJECT_STATE.collection("highlights").getAll()
        ).map((highlight): FilterableHighlight => {
          const filterableOutgoingRelations: FilterableOutgoingRelation[] =
            highlight.outgoingRelations.map((relation) => {
              const relationObj =
                PROJECT_STATE.collection("relations").get(relation);

              const arcName =
                relationObj.objectType === "Arc"
                  ? PROJECT_STATE.collection("arcs").get(relationObj.object)
                      .name
                  : "";

              return {
                objectId: relationObj.object,
                objectType: relationObj.objectType,
                predicate: relationObj.predicate,
                objectName: arcName,
              };
            });

          const highlightSRSCard =
            PROJECT_STATE.collection("srsCards").get(highlight.srsCard) ?? null;

          const srsCard = highlightSRSCard
            ? IpsumSRSCard.fromProjectStateCard(highlightSRSCard)
            : null;

          return {
            id: highlight.id,
            day: IpsumDay.fromString(highlight.history.dateCreated, "iso"),
            type: "highlight",
            outgoingRelations: filterableOutgoingRelations,
            srsCard,
          };
        });

        const { highlights: highlightResults } = program.evaluate({
          highlights: filterableHighlights,
        });

        return highlightResults
          .map((highlight) =>
            PROJECT_STATE.collection("highlights").get(highlight.id)
          )
          .slice(0, 50);
      },
      searchArcsByName(_, { args }) {
        const allArcs = Object.values(
          PROJECT_STATE.collection("arcs").getAll()
        );

        return allArcs.filter((arc) =>
          arc.name.toLowerCase().includes(args.search.toLowerCase())
        );
      },
    },
  },
};
