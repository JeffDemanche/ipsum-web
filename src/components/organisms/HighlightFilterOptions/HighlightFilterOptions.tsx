import cx from "classnames";
import { Type } from "components/atoms/Type";
import { RelationsTable } from "components/molecules/RelationsTable";
import React from "react";

import styles from "./HighlightFilterOptions.less";

interface HighlightFilterOptionsProps {
  className?: string;

  expanded: boolean;
  relations: {
    id: string;
    predicate: string;
    arc: {
      id: string;
      hue: number;
      name: string;
    };
  }[];
  onCreateRelation: (predicate: string) => void;
}

export const HighlightFilterOptions: React.FunctionComponent<
  HighlightFilterOptionsProps
> = ({ className, expanded, relations, onCreateRelation }) => {
  return (
    <div className={cx(className, styles["highlight-filter-options"])}>
      {expanded && (
        <Type variant="sans" size="small" weight="light">
          Filter
        </Type>
      )}
      <RelationsTable
        expanded={expanded}
        showAlias
        showDelete
        relations={relations}
      />
    </div>
  );
};
