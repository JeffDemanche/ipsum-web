import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "util/apollo";

import { HighlightPage } from "./HighlightPage";

interface HighlightPageConnectedProps {
  highlightId: string;
}

const HighlightPageQuery = gql(`
  query HighlightPage($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      arcs {
        id
        name
      }
      hue
      number
      objectText
      entry {
        entryKey
        htmlString
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
    }
  }  
`);

export const HighlightPageConnected: React.FunctionComponent<
  HighlightPageConnectedProps
> = ({ highlightId }) => {
  const { data } = useQuery(HighlightPageQuery, {
    variables: {
      highlightId,
    },
  });

  const highlight = data.highlight;

  return (
    <HighlightPage
      highlight={{
        id: highlight.id,
        htmlString: highlight.entry.htmlString,
        arcNames: highlight.arcs.map((arc) => arc.name),
        highlightNumber: highlight.number,
        hue: highlight.hue,
        objectText: highlight.objectText,
        relations: highlight.outgoingRelations.map((relation) => ({
          predicate: relation.predicate,
          arc: {
            id: relation.object.id,
            hue: relation.object.color,
            name: relation.object.name,
          },
        })),
      }}
      expanded
      onExpand={() => {}}
      onCollapse={() => {}}
    />
  );
};
