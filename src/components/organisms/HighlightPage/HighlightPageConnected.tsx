import { useQuery } from "@apollo/client";
import { useCommentsConnected } from "components/hooks/use-comments-connected";
import { useHighlightRelationsTableConnected } from "components/hooks/use-highlight-relations-table-connected";
import React from "react";
import { urlRemoveLayer, urlSetLayerExpanded, useUrlAction } from "util/api";
import { gql } from "util/apollo";
import { IpsumDay } from "util/dates";
import { useIpsumSearchParams } from "util/state";

import { HighlightPage } from "./HighlightPage";

interface HighlightPageConnectedProps {
  layerIndex: number;
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
      comments {
        id
        history {
          dateCreated
        }
        highlight {
          id
          number
          hue
          objectText
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
        commentEntry {
          entry {
            entryKey
            highlights {
              id
              number
              hue
              outgoingRelations {
                id
                predicate
                object {
                  ... on Arc {
                    id
                    name
                  }
                }
              }
            }
            htmlString
          }
        }
      }
    }
  }  
`);

export const HighlightPageConnected: React.FunctionComponent<
  HighlightPageConnectedProps
> = ({ layerIndex, highlightId }) => {
  const setLayerExpanded = useUrlAction(urlSetLayerExpanded);

  const removeLayer = useUrlAction(urlRemoveLayer);

  const { layers } = useIpsumSearchParams<"journal">();

  const { data } = useQuery(HighlightPageQuery, {
    variables: {
      highlightId,
    },
  });

  const relationsTableProps = useHighlightRelationsTableConnected({
    highlightId,
  });

  const commentsProps = useCommentsConnected({ highlightId });

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
          id: relation.id,
          predicate: relation.predicate,
          arc: {
            id: relation.object.id,
            hue: relation.object.color,
            name: relation.object.name,
          },
        })),
        comments: highlight.comments.map((comment) => ({
          id: comment.id,
          day: IpsumDay.fromString(comment.history.dateCreated, "iso"),
          highlight: {
            id: comment.highlight.id,
            arcNames: comment.highlight.outgoingRelations.map(
              (relation) => relation.object.name
            ),
            highlightNumber: comment.highlight.number,
            hue: comment.highlight.hue,
            objectText: comment.highlight.objectText,
          },
          commentEntry: {
            entryKey: comment.commentEntry.entry.entryKey,
            highlights: comment.commentEntry.entry.highlights.map(
              (highlight) => ({
                highlightId: highlight.id,
                highlightNumber: highlight.number,
                hue: highlight.hue,
                arcNames: highlight.outgoingRelations.map(
                  (relation) => relation.object.name
                ),
              })
            ),
            htmlString: comment.commentEntry.entry.htmlString,
          },
        })),
      }}
      relationTableProps={relationsTableProps}
      commentsProps={commentsProps}
      expanded={layers?.[layerIndex]?.expanded === "true"}
      onExpand={() => {
        setLayerExpanded({ index: layerIndex, expanded: true });
      }}
      onCollapse={() => {
        setLayerExpanded({ index: layerIndex, expanded: false });
      }}
      onClose={() => {
        removeLayer({ index: layerIndex });
      }}
    />
  );
};
