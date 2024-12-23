import { useQuery } from "@apollo/client";
import ErrorBoundary from "components/atoms/ErrorBoundary";
import { useHighlightFunctionButtonsConnected } from "components/hooks/use-highlight-function-buttons-connected";
import { useHighlightRelationsTableConnected } from "components/hooks/use-highlight-relations-table-connected";
import { useHighlightSRSButtonsConnected } from "components/hooks/use-highlight-srs-buttons-connected";
import { useCommentsNavigatorConnected } from "components/molecules/CommentsNavigator";
import { PageHeaderError } from "components/molecules/PageHeader";
import React from "react";
import { urlRemoveLayer, urlSetLayerExpanded, useUrlAction } from "util/api";
import { gql } from "util/apollo";
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
        objectHighlight {
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
      }
    }
  }  
`);

export const HighlightPageConnected: React.FunctionComponent<
  HighlightPageConnectedProps
> = (props) => {
  const removeLayer = useUrlAction(urlRemoveLayer);

  const onClose = () => {
    removeLayer({ index: props.layerIndex });
  };

  return (
    <ErrorBoundary
      fallback={
        <PageHeaderError onClose={onClose} text="Error in highlight page" />
      }
    >
      <WithErrorBoundary {...props} />
    </ErrorBoundary>
  );
};

const WithErrorBoundary: React.FunctionComponent<
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

  const commentsProps = useCommentsNavigatorConnected({ highlightId });

  const highlightSRSButtonsProps = useHighlightSRSButtonsConnected({
    highlightId,
  });

  const highlightFunctionButtonsProps = useHighlightFunctionButtonsConnected({
    highlightId,
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
        relations: highlight.outgoingRelations
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
          .filter(Boolean),
      }}
      highlightFunctionButtonsProps={highlightFunctionButtonsProps}
      highlightSRSButtonsProps={highlightSRSButtonsProps}
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
