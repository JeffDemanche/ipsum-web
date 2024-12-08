import { useQuery } from "@apollo/client";
import { HighlightBlurb } from "components/molecules/HighlightBlurb";
import { urlInsertLayer, useUrlAction } from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";

import { useHighlightFunctionButtonsConnected } from "./use-highlight-function-buttons-connected";
import { useHighlightRelationsTableConnected } from "./use-highlight-relations-table-connected";
import { useHighlightSRSButtonsConnected } from "./use-highlight-srs-buttons-connected";

export type HighlightBlurbConnectedProps = Pick<
  React.ComponentProps<typeof HighlightBlurb>,
  | "highlightProps"
  | "excerptProps"
  | "relations"
  | "relationsTableProps"
  | "onHighlightClick"
  | "onHighlightObjectClick"
  | "highlightFunctionButtonsProps"
  | "highlightSRSButtonsProps"
>;

const UseHighlightBlurbConnectedQuery = gql(`
  query UseHighlightBlurbConnected($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      excerpt
      hue
      number
      objectText
      importanceRatings {
        day {
          day
        }
      }
      outgoingRelations {
        id
        predicate
        object {
          __typename
          ... on Arc {
            id
            name
            color
          }
          ... on Highlight {
            id
          }
        }
      }
      object {
        __typename
        ... on Arc {
          id
        }
        ... on Day {
          day
        }
      }
    }
  }  
`);

export const useHighlightBlurbConnected = ({
  highlightId,
}: {
  highlightId: string;
}): HighlightBlurbConnectedProps => {
  const { data } = useQuery(UseHighlightBlurbConnectedQuery, {
    variables: { highlightId },
  });

  const insertLayer = useUrlAction(urlInsertLayer);

  const highlight = data?.highlight;

  const relationsTableProps = useHighlightRelationsTableConnected({
    highlightId,
  });

  const highlightProps: HighlightBlurbConnectedProps["highlightProps"] = {
    highlightId,
    objectText: highlight.objectText,
    hue: highlight.hue,
    highlightNumber: highlight.number,
    arcNames: highlight.outgoingRelations
      .map((relation) =>
        relation.object.__typename === "Arc" ? relation.object.name : undefined
      )
      .filter(Boolean),
    importanceRating: 0,
  };

  const excerptProps: HighlightBlurbConnectedProps["excerptProps"] = {
    htmlString: highlight.excerpt,
    maxLines: 5,
  };

  const arcRelations = highlight.outgoingRelations.filter(
    (relation) => relation.object && relation.object.__typename === "Arc"
  );

  const relations: HighlightBlurbConnectedProps["relations"] = arcRelations
    .map((relation) =>
      relation.object.__typename === "Arc"
        ? {
            id: relation.id,
            predicate: relation.predicate,
            arc: {
              id: relation.object.id,
              hue: relation.object.color,
              name: relation.object.name,
            },
          }
        : undefined
    )
    .filter(Boolean);

  const onHighlightClick = () => {
    insertLayer({
      layer: { type: "highlight_detail", highlightId, expanded: "true" },
    });
  };

  const onHighlightObjectClick = () => {
    switch (highlight.object.__typename) {
      case "Day":
        insertLayer({
          layer: {
            type: "daily_journal",
            day: IpsumDay.fromString(
              highlight.object.day,
              "entry-printed-date"
            ).toString("url-format"),
            expanded: "true",
          },
        });
        break;
      case "Arc":
        insertLayer({
          layer: {
            type: "arc_detail",
            arcId: highlight.object.id,
            expanded: "true",
          },
        });
        break;
    }
  };

  const highlightFunctionButtonsProps = useHighlightFunctionButtonsConnected({
    highlightId,
  });
  const highlightSRSButtonsProps = useHighlightSRSButtonsConnected({
    highlightId,
  });

  return {
    highlightProps,
    relationsTableProps,
    relations,
    excerptProps,
    onHighlightClick,
    onHighlightObjectClick,
    highlightFunctionButtonsProps,
    highlightSRSButtonsProps,
  };
};
