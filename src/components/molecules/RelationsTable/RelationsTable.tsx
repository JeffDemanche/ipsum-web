import cx from "classnames";
import { Button } from "components/atoms/Button";
import { MiniButton } from "components/atoms/MiniButton";
import { Popover } from "components/atoms/Popover";
import { Type } from "components/atoms/Type";
import { ArcTag } from "components/molecules/ArcTag";
import { grey700, grey800 } from "components/styles";
import React, { useMemo, useRef, useState } from "react";

import styles from "./RelationsTable.less";

interface Relation {
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

  onCreateRelation?: () => void;
  onDeleteRelation?: (relation: Relation) => void;

  showAlias?: boolean;
  showEdit?: boolean;

  relations?: Relation[];
  clauses?: {
    and: {
      orRelations: Relation[];
    }[];
  };
}

export const RelationsTable: React.FunctionComponent<RelationsTableProps> = ({
  editable,
  expanded,
  onCreateRelation,
  onDeleteRelation,
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

  const [createRelationAnchorEl, setCreateRelationAnchorEl] =
    useState<HTMLElement>(null);

  const predicateRows = useMemo(() => {
    if (relations) {
      return Object.keys(relationsByPredicate).map((predicate) => {
        return (
          <div className={styles["predicate-row"]} key={predicate}>
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
                  onDelete={() => onDeleteRelation?.(relation)}
                  showDelete={editable}
                />
              );
            })}
            {editable && (
              <Button
                className={styles["link-button"]}
                disableRipple={false}
                variant="link"
                onClick={(e) => {
                  setCreateRelationAnchorEl(e.currentTarget);
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
                    onDelete={() => onDeleteRelation?.(relation)}
                    showDelete={editable}
                  />
                );
              })}
              {editable && (
                <Button
                  className={styles["link-button"]}
                  disableRipple={false}
                  variant="link"
                  onClick={(e) => {
                    setCreateRelationAnchorEl(e.currentTarget);
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
    onDeleteRelation,
    relations,
    relationsByPredicate,
    relationsByPredicateAndClause,
  ]);

  return (
    <div
      className={cx(
        styles["relations-table"],
        !expanded && styles["collapsed"]
      )}
    >
      <Popover
        onClose={() => {
          setCreateRelationAnchorEl(null);
        }}
        anchorEl={createRelationAnchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        relation chooser
      </Popover>
      {predicateRows}
      {editable && (
        <div className={styles["predicate-row"]}>
          <Button
            className={styles["link-button"]}
            disableRipple={false}
            variant="link"
            onClick={(e) => {
              setCreateRelationAnchorEl(e.currentTarget);
            }}
          >
            + add
          </Button>
        </div>
      )}
    </div>
  );
};
