import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { ArcChipConnected } from "components/ArcChip";
import {
  ArcSearchAutocomplete,
  ArcSearchResult,
} from "components/ArcSearchAutocomplete";
import { DiptychContext } from "components/DiptychContext";
import React, { useCallback, useContext, useMemo } from "react";
import { theme } from "styles/styles";
import { createArc, createRelation, deleteRelation, gql } from "util/apollo";
import styles from "./HighlightRelationsTable.less";

const HighlightRelationsTableQuery = gql(`
  query HighlightRelationsTable($highlightId: ID!) {
    highlight(id: $highlightId) {
      id
      entry {
        entryKey
        date
      }
      outgoingRelations {
        __typename
        id
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

interface HighlightRelationsTableProps {
  highlightId: string;
  showPlusButton?: boolean;
}

export const HighlightRelationsTable: React.FunctionComponent<
  HighlightRelationsTableProps
> = ({ highlightId, showPlusButton }) => {
  const { data } = useQuery(HighlightRelationsTableQuery, {
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

  const unlinkArc = useCallback((relationId: string) => {
    deleteRelation(relationId);
  }, []);

  const createArcFromAutocomplete = useCallback((name: string) => {
    const arc = createArc({ name });
    return arc.id;
  }, []);

  const onAutocompleteChange = useCallback(
    (value: ArcSearchResult[]) => {
      if (!value || value.length === 0 || value[0].newArcProps) return;

      linkArc(value[0].arcId);
    },
    [linkArc]
  );

  const relationsMarkup = useMemo(
    () =>
      Object.keys(relationsGroupedByPredicate).map((predicate, i) => (
        <div className={styles["predicate-group"]} key={i}>
          <Typography
            className={styles["predicate-name"]}
            variant="body2"
            display="flex"
            color={theme.palette.onSurfaceMediumEmphasis}
          >
            {predicate}&nbsp;
          </Typography>
          <div className={styles["predicate-relations"]}>
            {relationsGroupedByPredicate[predicate].map((relation, i) => (
              <ArcChipConnected
                arcId={relation.object.id}
                onClick={(e) => {
                  onArcClick(relation.object.id, e);
                }}
                onDelete={() => {
                  unlinkArc(relation.id);
                }}
                key={i}
              ></ArcChipConnected>
            ))}
          </div>
        </div>
      )),
    [onArcClick, relationsGroupedByPredicate, unlinkArc]
  );

  return (
    <div className={styles["details-relations"]}>
      <div className={styles["relations-right"]}>
        <div className={styles["relations"]}>{relationsMarkup}</div>
        {showPlusButton && (
          <div className={styles["autocomplete-row"]}>
            <ArcSearchAutocomplete
              className={styles["assign-arc-autocomplete"]}
              allowCreate
              multiple={false}
              value={undefined}
              onChange={onAutocompleteChange}
              onNewArc={createArcFromAutocomplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};
