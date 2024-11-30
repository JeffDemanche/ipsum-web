import { useQuery } from "@apollo/client";
import { useArcRelationsTableConnected } from "components/hooks/use-arc-relations-table-connected";
import React from "react";
import { urlRemoveLayer, urlSetLayerExpanded, useUrlAction } from "util/api";
import { gql } from "util/apollo";
import { useIpsumSearchParams } from "util/state";

import { ArcPage } from "./ArcPage";

interface ArcPageConnectedProps {
  layerIndex: number;
  arcId: string;
}

const ArcPageQuery = gql(`
  query ArcPage($arcId: ID!) {
    arc(id: $arcId) {
      id
      name
      color
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
      arcEntry {
        entry {
          entryKey
          htmlString
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
                  color
                }
              }
            }
          }
        }
      }
    }
  }
`);

export const ArcPageConnected: React.FunctionComponent<
  ArcPageConnectedProps
> = ({ layerIndex, arcId }) => {
  const { data } = useQuery(ArcPageQuery, {
    variables: {
      arcId,
    },
  });

  const arc = data.arc;

  const arcOutgoingRelations: React.ComponentProps<
    typeof ArcPage
  >["arc"]["relations"] = arc.outgoingRelations.map((relation) => ({
    id: relation.id,
    arc: {
      id: relation.object.id,
      hue: relation.object.color,
      name: relation.object.name,
    },
    predicate: relation.predicate,
  }));

  const arcEntryHighlights: React.ComponentProps<
    typeof ArcPage
  >["arcEntry"]["highlights"] = arc.arcEntry.entry.highlights.map(
    (highlight) => ({
      highlightId: highlight.id,
      arcNames: highlight.outgoingRelations.map(
        (relation) => relation.object.name
      ),
      highlightNumber: highlight.number,
      hue: highlight.hue,
    })
  );

  const { layers } = useIpsumSearchParams<"journal">();

  const setLayerExpanded = useUrlAction(urlSetLayerExpanded);

  const removeLayer = useUrlAction(urlRemoveLayer);

  const relationTableProps = useArcRelationsTableConnected({ arcId });

  return (
    <ArcPage
      arc={{
        id: arc.id,
        hue: arc.color,
        name: arc.name,
        relations: arcOutgoingRelations,
      }}
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
      arcEntry={{
        highlights: arcEntryHighlights,
        htmlString: arc.arcEntry.entry.htmlString,
      }}
      relationsTableProps={relationTableProps}
    />
  );
};
