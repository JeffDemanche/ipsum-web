import cx from "classnames";
import { Type } from "components/atoms/Type";
import { ArcTag } from "components/molecules/ArcTag";
import { grey800 } from "components/styles";
import React, { useMemo } from "react";

import styles from "./RelationsTable.less";

interface RelationsTableProps {
  expanded: boolean;
  showAlias?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  relations: {
    id: string;
    predicate: string;
    arc: {
      id: string;
      hue: number;
      name: string;
    };
  }[];
}

export const RelationsTable: React.FunctionComponent<RelationsTableProps> = ({
  expanded,
  showAlias,
  showEdit,
  showDelete,
  relations,
}) => {
  const relationsByPredicate = useMemo(() => {
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

  const predicateRows = useMemo(() => {
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
                showAlias={showAlias ?? expanded}
                showEdit={showEdit ?? expanded}
                showDelete={showDelete ?? expanded}
              />
            );
          })}
        </div>
      );
    });
  }, [expanded, relationsByPredicate, showAlias, showDelete, showEdit]);

  return (
    <div
      className={cx(
        styles["relations-table"],
        !expanded && styles["collapsed"]
      )}
    >
      {predicateRows}
    </div>
  );
};
