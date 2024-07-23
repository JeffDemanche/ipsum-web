import cx from "classnames";
import { Button } from "components/atoms/Button";
import { Type } from "components/atoms/Type";
import { RelationsTable } from "components/molecules/RelationsTable";
import { grey800 } from "components/styles";
import React from "react";
import { IpsumDay } from "util/dates";

import styles from "./HighlightFilterOptions.less";

interface HighlightFilterOptionsProps {
  className?: string;

  expanded: boolean;
  dateFilterFrom?: IpsumDay;
  dateFilterTo?: IpsumDay;
  clauses: React.ComponentProps<typeof RelationsTable>["clauses"];
  onCreateClause: (
    afterRelationId: string,
    predicate: string,
    arcId: string
  ) => void;
}

export const HighlightFilterOptions: React.FunctionComponent<
  HighlightFilterOptionsProps
> = ({
  className,
  expanded,
  dateFilterFrom,
  dateFilterTo,
  clauses,
  onCreateClause,
}) => {
  const dateLabel = (date: IpsumDay | undefined) => {
    if (date) {
      if (date.isToday()) return "today";
      return date.toString("entry-printed-date");
    }
    return undefined;
  };

  return (
    <div className={cx(className, styles["highlight-filter-options"])}>
      {expanded && (
        <Type color={grey800} variant="sans" size="small" weight="light">
          Filter
        </Type>
      )}
      <div className={styles["date-filters"]}>
        <Type color={grey800} variant="sans" size="x-small" weight="light">
          from
        </Type>
        <Button className={styles["date-button"]} variant="outlined">
          {dateLabel(dateFilterFrom) ?? "beginning"}
        </Button>
        <Type color={grey800} variant="sans" size="x-small" weight="light">
          to
        </Type>
        <Button className={styles["date-button"]} variant="outlined">
          {dateLabel(dateFilterTo) ?? "today"}
        </Button>
      </div>
      <RelationsTable
        expanded={expanded}
        showAlias
        showDelete
        clauses={clauses}
      />
    </div>
  );
};
