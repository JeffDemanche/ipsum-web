import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from "util/apollo";

import { ArcPage } from "./ArcPage";

interface ArcPageConnectedProps {
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
> = ({ arcId }) => {
  const { data } = useQuery(ArcPageQuery, {
    variables: {
      arcId,
    },
  });

  const arc = data.arc;

  const arcOutgoingRelations: React.ComponentProps<
    typeof ArcPage
  >["arc"]["relations"] = arc.outgoingRelations.map((relation) => ({
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

  return (
    <ArcPage
      arc={{ hue: arc.color, name: arc.name, relations: arcOutgoingRelations }}
      expanded
      onExpand={() => {}}
      onCollapse={() => {}}
      arcEntry={{
        highlights: arcEntryHighlights,
        htmlString: arc.arcEntry.entry.htmlString,
      }}
    />
  );
};
