import cx from "classnames";
import { Button } from "components/atoms/Button";
import { Popover } from "components/atoms/Popover";
import { Type } from "components/atoms/Type";
import { RelationsTable } from "components/molecules/RelationsTable";
import { grey800 } from "components/styles";
import React, { useState } from "react";
import { IpsumDay } from "util/dates";

import { DatePicker } from "../DatePicker";
import styles from "./HighlightFilterOptions.less";

interface HighlightFilterOptionsProps {
  className?: string;

  expanded: boolean;
  dateFilterFrom?: IpsumDay;
  onChangeDateFilterFrom?: (date: IpsumDay) => void;
  dateFilterTo?: IpsumDay;
  onChangeDateFilterTo?: (date: IpsumDay) => void;
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
  onChangeDateFilterFrom,
  dateFilterTo,
  onChangeDateFilterTo,
  clauses,
  onCreateClause,
}) => {
  const dateLabel = (date: IpsumDay | undefined) => {
    if (date) {
      if (date.isToday()) return "Today";
      return date.toString("entry-printed-date");
    }
    return undefined;
  };

  const [dayFromAnchorRef, setDayFromAnchorRef] = useState<HTMLElement | null>(
    null
  );
  const [dayToAnchorRef, setDayToAnchorRef] = useState<HTMLElement | null>(
    null
  );

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
        <Button
          className={styles["date-button"]}
          variant="outlined"
          onClick={(e) => {
            setDayFromAnchorRef(e.currentTarget);
          }}
          aria-label="Highlight filter date from"
        >
          {dateLabel(dateFilterFrom) ?? "beginning"}
        </Button>
        <Popover
          onClose={() => {
            setDayFromAnchorRef(null);
          }}
          anchorEl={dayFromAnchorRef}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          <DatePicker
            selectedDay={dateFilterFrom}
            onSelect={(day) => {
              onChangeDateFilterFrom(day);
              setDayFromAnchorRef(null);
            }}
          />
        </Popover>
        <Type color={grey800} variant="sans" size="x-small" weight="light">
          to
        </Type>
        <Button
          className={styles["date-button"]}
          variant="outlined"
          onClick={(e) => {
            setDayToAnchorRef(e.currentTarget);
          }}
          aria-label="Highlight filter date to"
        >
          {dateLabel(dateFilterTo) ?? "today"}
        </Button>
        <Popover
          onClose={() => {
            setDayToAnchorRef(null);
          }}
          anchorEl={dayToAnchorRef}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          <DatePicker
            selectedDay={dateFilterTo}
            onSelect={(day) => {
              onChangeDateFilterTo(day);
              setDayToAnchorRef(null);
            }}
          />
        </Popover>
      </div>
    </div>
  );
};
