import cx from "classnames";
import { Button } from "components/atoms/Button";
import { MenuItem } from "components/atoms/MenuItem";
import { Popover } from "components/atoms/Popover";
import { Select } from "components/atoms/Select";
import { Type } from "components/atoms/Type";
import React, { useState } from "react";
import { IpsumDay } from "util/dates";
import { SortType, sortTypes } from "util/sort";

import { DatePicker } from "../DatePicker";
import styles from "./HighlightSortOptions.less";

interface HighlightSortOptionsProps {
  className?: string;

  expanded: boolean;
  sortType: SortType;
  sortDay: IpsumDay;

  onSortTypeChange: (sortType: string) => void;
  onSortDayChange: (sortDay: IpsumDay) => void;
}

export const HighlightSortOptions: React.FunctionComponent<
  HighlightSortOptionsProps
> = ({
  className,
  expanded,
  sortType,
  sortDay,
  onSortTypeChange,
  onSortDayChange,
}) => {
  const sortTypeSelect = (
    <Select className={styles["input-element"]} value={sortType}>
      {sortTypes.map((type) => (
        <MenuItem
          key={type}
          value={type}
          onClick={() => onSortTypeChange(type)}
        >
          {type}
        </MenuItem>
      ))}
    </Select>
  );

  const [sortDayAnchorRef, setSortDayAnchorRef] = useState<HTMLElement | null>(
    null
  );

  const onDaySelect = (day: IpsumDay) => {
    onSortDayChange(day);
    setSortDayAnchorRef(null);
  };

  return (
    <div className={cx(className, styles["highlight-sort-options"])}>
      {expanded && (
        <Type variant="sans" size="small" weight="light">
          Sort
        </Type>
      )}
      <div
        className={cx(
          styles["inputs"],
          expanded ? styles["expanded"] : styles["collapsed"]
        )}
      >
        {sortTypeSelect}
        <Button
          variant="outlined"
          onClick={(event) => {
            setSortDayAnchorRef(event.currentTarget);
          }}
          className={styles["input-element"]}
        >
          {sortDay.toString("entry-printed-date")}
        </Button>
        <Popover
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          anchorEl={sortDayAnchorRef}
          onClose={() => {
            setSortDayAnchorRef(null);
          }}
        >
          <DatePicker selectedDay={sortDay} onSelect={onDaySelect} />
        </Popover>
      </div>
    </div>
  );
};
