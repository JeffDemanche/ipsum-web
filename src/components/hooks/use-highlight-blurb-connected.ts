import { useQuery } from "@apollo/client";
import { HighlightBlurb } from "components/molecules/HighlightBlurb";
import {
  apiDeleteHighlight,
  urlInsertLayer,
  useApiAction,
  useUrlAction,
} from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";

import { useHighlightRelationsTableConnected } from "./use-highlight-relations-table-connected";

export type HighlightBlurbConnectedProps = Pick<
  React.ComponentProps<typeof HighlightBlurb>,
  | "highlightProps"
  | "onDelete"
  | "excerptProps"
  | "onHighlightClick"
  | "onHighlightObjectClick"
  | "onRateDown"
  | "onRateNeutral"
  | "onRateUp"
  | "relations"
  | "relationsTableProps"
  | "onStartSRS"
  | "reviewState"
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
          ... on Arc {
            id
            name
            color
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
        ... on Comment {
          id
          highlight {
            id
          }
        }
      }
      history {
        dateCreated
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

  const [deleteHighlight] = useApiAction(apiDeleteHighlight);

  const highlight = data?.highlight;

  const relationsTableProps = useHighlightRelationsTableConnected();

  const highlightProps: HighlightBlurbConnectedProps["highlightProps"] = {
    highlightId,
    objectText: highlight.objectText,
    hue: highlight.hue,
    highlightNumber: highlight.number,
    arcNames: highlight.outgoingRelations.map(
      (relation) => relation.object.name
    ),
    importanceRating: 0,
  };

  const excerptProps: HighlightBlurbConnectedProps["excerptProps"] = {
    htmlString: highlight.excerpt,
    maxLines: 3,
  };

  const arcRelations = highlight.outgoingRelations.filter(
    (relation) => relation.object && relation.object.__typename === "Arc"
  );

  const relations: HighlightBlurbConnectedProps["relations"] = arcRelations.map(
    (relation) => ({
      id: relation.id,
      predicate: relation.predicate,
      arc: {
        id: relation.object.id,
        hue: relation.object.color,
        name: relation.object.name,
      },
    })
  );

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
      case "Comment":
        insertLayer({
          layer: { type: "highlight_detail", highlightId, expanded: "true" },
        });
    }
  };

  const onDelete = () => {
    deleteHighlight({ id: highlightId });
  };

  return {
    highlightProps,
    relationsTableProps,
    relations,
    excerptProps,
    onHighlightClick,
    onHighlightObjectClick,
    onDelete,
    onRateDown: () => {},
    onRateNeutral: () => {},
    onRateUp: () => {},
    onStartSRS: () => {},
    reviewState: "none",
  };
};
