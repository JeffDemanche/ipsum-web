import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { ArcTag } from "components/ArcTag";
import { DiptychContext } from "components/DiptychContext";
import { Linker } from "components/Linker";
import React, { useCallback, useContext, useMemo } from "react";
import { theme } from "styles/styles";
import { createArc, createRelation, gql } from "util/apollo";
import styles from "./HighlightBox.less";

const HighlightBoxRelationsQuery = gql(`
  query HighlightBox($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      entry {
        entryKey
        date
      }
      outgoingRelations {
        __typename
        predicate
        object {
          ... on Arc {
            id
            color
          }
        }
      }
    }
  }
`);

interface HighlightBoxRelationsProps {
  highlightId: string;
}

export const HighlightBoxRelations: React.FunctionComponent<
  HighlightBoxRelationsProps
> = ({ highlightId }) => {
  const { data } = useQuery(HighlightBoxRelationsQuery, {
    variables: { highlightId },
  });

  const { pushLayer } = useContext(DiptychContext);

  const onArcClick = useCallback(
    (arcId?: string, e?: React.MouseEvent) => {
      e.stopPropagation();
      arcId && pushLayer({ type: "arc_detail", arcId });
    },
    [pushLayer]
  );

  const highlight = data?.highlight;
  const highlightRelations = highlight?.outgoingRelations;

  const relationsGroupedByPredicate = useMemo(
    () =>
      highlightRelations?.reduce((acc, relation) => {
        if (!acc[relation.predicate]) acc[relation.predicate] = [];
        acc[relation.predicate].push(relation);
        return acc;
      }, {} as Record<string, typeof highlightRelations>),
    [highlightRelations]
  );

  console.log(relationsGroupedByPredicate);

  const linkArc = useCallback(
    (arcId: string) => {
      createRelation({
        subject: highlight.id,
        subjectType: "Highlight",
        predicate: "relates to",
        object: arcId,
        objectType: "Arc",
      });
    },
    [highlight]
  );

  const createAndLinkArc = useCallback(
    (name: string) => {
      const arc = createArc({ name });
      linkArc(arc.id);
    },
    [linkArc]
  );

  const relationsMarkup = useMemo(
    () =>
      Object.keys(relationsGroupedByPredicate).map((predicate, i) => (
        <div className={styles["predicate-group"]} key={i}>
          <Typography
            variant="body2"
            display="flex"
            color={theme.palette.onSurfaceMediumEmphasis}
          >
            {predicate}&nbsp;
          </Typography>
          <div className={styles["predicate-relations"]}>
            {relationsGroupedByPredicate[predicate].map((relation, i) => (
              <ArcTag
                arcForToken={{
                  type: "from id",
                  id: relation.object.id,
                }}
                onClick={onArcClick}
                key={i}
              ></ArcTag>
            ))}
          </div>
        </div>
      )),
    [onArcClick, relationsGroupedByPredicate]
  );

  return (
    <div className={styles["details-relations"]}>
      <div className={styles["relations-right"]}>
        <div className={styles["relations"]}>{relationsMarkup}</div>
        <div>
          <Linker
            onAddArc={createAndLinkArc}
            onChooseArc={linkArc}
            className={styles["linker"]}
          ></Linker>
        </div>
      </div>
    </div>
  );
};
