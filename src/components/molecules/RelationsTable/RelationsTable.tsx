import cx from "classnames";
import { Button } from "components/atoms/Button";
import { Popover } from "components/atoms/Popover";
import { Type } from "components/atoms/Type";
import type { RelationChooserConnectedProps } from "components/hooks/use-relation-chooser-connected";
import { ArcTag } from "components/molecules/ArcTag";
import { grey700, grey800 } from "components/styles";
import React, { useMemo, useState } from "react";
import type { RelationSubject } from "util/apollo";
import { TestIds } from "util/test-ids";

import { RelationChooser } from "../RelationChooser/RelationChooser";
import type { Relation as RelationChooserRelation } from "../RelationChooser/types";
import styles from "./RelationsTable.less";

interface RelationsTableRelation {
  id: string;
  predicate: string;
  arc: {
    id: string;
    hue: number;
    name: string;
  };
}

interface RelationsTableProps {
  editable?: boolean;
  expanded: boolean;

  subjectType: RelationSubject["__typename"];
  subjectId: string;

  relationChooserProps: RelationChooserConnectedProps;

  onCreateRelation?: (relation: RelationChooserRelation) => void;
  onDeleteRelation?: (id: string) => void;

  allowCreation?: React.ComponentProps<typeof RelationChooser>["allowCreation"];

  onArcClick?: (arcId: string) => void;

  showAlias?: boolean;
  showEdit?: boolean;

  relations?: RelationsTableRelation[];
  clauses?: {
    and: {
      orRelations: RelationsTableRelation[];
    }[];
  };
}

export const RelationsTable: React.FunctionComponent<RelationsTableProps> = ({
  editable,
  expanded,
  subjectType,
  subjectId,
  relationChooserProps,
  onDeleteRelation,
  allowCreation,
  onArcClick,
  showAlias,
  showEdit,
  relations,
  clauses,
}) => {
  if (!relations && !clauses) {
    throw new Error("RelationsTable must have either relations or clauses");
  }
  if (relations && clauses) {
    throw new Error("RelationsTable cannot have both relations and clauses");
  }

  const relationsByPredicate = useMemo(() => {
    if (!relations) {
      return {};
    }

    return relations.reduce(
      (acc, relation) => {
        if (!acc[relation.predicate]) {
          acc[relation.predicate] = [];
        }
        acc[relation.predicate].push(relation);
        return acc;
      },
      {} as Record<string, typeof relations>
    );
  }, [relations]);

  const relationsByPredicateAndClause = useMemo(() => {
    if (!clauses) {
      return [];
    }

    return clauses.and.map((andClause) => {
      return andClause.orRelations.reduce(
        (acc, relation) => {
          if (!acc[relation.predicate]) {
            acc[relation.predicate] = [];
          }
          acc[relation.predicate].push(relation);
          return acc;
        },
        {} as Record<string, typeof relations>
      );
    });
  }, [clauses]);

  const [createRelationAnchor, setCreateRelationAnchor] =
    useState<HTMLElement>();
  const [showCreateRelationPopover, setShowCreateRelationPopover] =
    useState<boolean>(false);
  const [relationChooserDefaultPredicate, setRelationChooserDefaultPredicate] =
    useState<string>("relates to");

  const predicateRows = useMemo(() => {
    if (relations) {
      return Object.keys(relationsByPredicate).map((predicate) => {
        return (
          <div
            data-testid={TestIds.RelationsTable.PredicateRow}
            className={styles["predicate-row"]}
            key={predicate}
          >
            <Type color={grey800} size="x-small" weight="light">
              {predicate}
            </Type>
            {relationsByPredicate[predicate].map((relation) => {
              return (
                <ArcTag
                  fontSize="x-small"
                  key={relation.id}
                  hue={relation.arc.hue}
                  text={relation.arc.name}
                  onDelete={() => onDeleteRelation?.(relation.id)}
                  showDelete={editable}
                  onClick={() => onArcClick?.(relation.arc.id)}
                />
              );
            })}
            {editable && (
              <Button
                className={styles["link-button"]}
                disableRipple={false}
                variant="link"
                onClick={(e) => {
                  setRelationChooserDefaultPredicate(predicate);
                  setCreateRelationAnchor(e.currentTarget);
                  setShowCreateRelationPopover(true);
                }}
              >
                + add
              </Button>
            )}
          </div>
        );
      });
    } else {
      return relationsByPredicateAndClause.map((relationsByPredicate) => {
        return Object.keys(relationsByPredicate).map((predicate, i) => {
          const andOr: "and" | "or" = i === 0 ? "and" : "or";

          return (
            <div
              className={cx(styles["predicate-row"], {
                [styles["or-row"]]: andOr === "or",
                [styles["and-row"]]: andOr === "and",
              })}
              key={predicate}
            >
              <Type color={grey700} size="x-small" weight="light">
                {andOr}
              </Type>
              <Type color={grey800} size="x-small" weight="light">
                {predicate}
              </Type>
              {relationsByPredicate[predicate].map((relation) => {
                return (
                  <ArcTag
                    fontSize="x-small"
                    key={relation.arc.id}
                    hue={relation.arc.hue}
                    text={relation.arc.name}
                    onDelete={() => onDeleteRelation?.(relation.id)}
                    showDelete={editable}
                    onClick={() => onArcClick?.(relation.arc.id)}
                  />
                );
              })}
              {editable && (
                <Button
                  className={styles["link-button"]}
                  disableRipple={false}
                  variant="link"
                  onClick={(e) => {
                    setCreateRelationAnchor(e.currentTarget);
                    setShowCreateRelationPopover(true);
                  }}
                >
                  + add
                </Button>
              )}
            </div>
          );
        });
      });
    }
  }, [
    editable,
    onArcClick,
    onDeleteRelation,
    relations,
    relationsByPredicate,
    relationsByPredicateAndClause,
  ]);

  return (
    <div
      data-testid={TestIds.RelationsTable.RelationsTable}
      className={cx(
        styles["relations-table"],
        !expanded && styles["collapsed"]
      )}
    >
      <Popover
        open={showCreateRelationPopover}
        onClose={() => {
          setShowCreateRelationPopover(false);
          setCreateRelationAnchor(undefined);
        }}
        anchorEl={createRelationAnchor}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <RelationChooser
          {...relationChooserProps}
          defaultSelectedPredicate={relationChooserDefaultPredicate}
          onCloseAction={() => {
            setShowCreateRelationPopover(false);
            setCreateRelationAnchor(undefined);
          }}
          maxArcResults={8}
          subjectType={subjectType}
          subjectId={subjectId}
          allowCreation={allowCreation}
          defaultSearch=""
        />
      </Popover>
      {predicateRows}
      {editable && !predicateRows.length && (
        <div
          data-testid={TestIds.RelationsTable.PredicateRow}
          className={styles["predicate-row"]}
        >
          <Button
            data-testid={TestIds.RelationsTable.EmptyTableAddLinkButton}
            className={styles["link-button"]}
            disableRipple={false}
            variant="link"
            onClick={(e) => {
              setRelationChooserDefaultPredicate("relates to");
              setCreateRelationAnchor(e.currentTarget);
              setShowCreateRelationPopover(true);
            }}
          >
            + add
          </Button>
        </div>
      )}
    </div>
  );
};
