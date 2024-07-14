import cx from "classnames";
import { Button } from "components/atoms/Button";
import { Type } from "components/atoms/Type";
import { RelationsTable } from "components/molecules/RelationsTable";
import { border_dashed, grey800, grid_x_1 } from "components/styles";
import React from "react";
import { IpsumDay } from "util/dates";

import styles from "./HighlightFilterOptions.less";

interface HighlightFilterOptionsProps {
  className?: string;

  expanded: boolean;
  dateFilterFrom?: IpsumDay;
  dateFilterTo?: IpsumDay;
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
> = ({
  className,
  expanded,
  dateFilterFrom,
  dateFilterTo,
  relations,
  onCreateRelation,
}) => {
  const dateLabel = (date: IpsumDay | undefined) => {
    if (date) {
      if (date.isToday()) return "today";
      return date.toString("entry-printed-date");
    }
    return "any";
  };

  return (
    <div className={cx(className, styles["highlight-filter-options"])}>
      {expanded && (
        <Type color={grey800} variant="sans" size="small" weight="light">
          Filter
        </Type>
      )}
      <div
        className={styles["date-filters"]}
        style={{ marginBottom: expanded ? "0" : grid_x_1 }}
      >
        <Type color={grey800} variant="sans" size="x-small" weight="light">
          from
        </Type>
        <Button className={styles["date-button"]} variant="outlined">
          {dateLabel(dateFilterFrom)}
        </Button>
        <Type color={grey800} variant="sans" size="x-small" weight="light">
          to
        </Type>
        <Button className={styles["date-button"]} variant="outlined">
          {dateLabel(dateFilterTo)}
        </Button>
      </div>
      {expanded && (
        <hr style={{ border: "none", borderTop: border_dashed }}></hr>
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
