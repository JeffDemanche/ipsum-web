import { Drawer } from "components/atoms/Drawer";
import React from "react";
import { IpsumDay } from "util/dates";
import { SortType } from "util/sort";

import { HighlightSortOptions } from "../HighlightSortOptions";

interface HighlightResultsOptionsDrawerProps {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;

  sortType: SortType;
  sortDay: IpsumDay;
  onSortTypeChange: (sortType: string) => void;
  onSortDayChange: (sortDay: IpsumDay) => void;
}

export const HighlightResultsOptionsDrawer: React.FunctionComponent<
  HighlightResultsOptionsDrawerProps
> = ({
  expanded,
  onExpand,
  onCollapse,
  sortType,
  sortDay,
  onSortDayChange,
  onSortTypeChange,
}) => {
  const openedContent = (
    <div>
      <HighlightSortOptions
        sortType={sortType}
        sortDay={sortDay}
        onSortTypeChange={onSortTypeChange}
        onSortDayChange={onSortDayChange}
        expanded
      />
    </div>
  );

  const closedContent = (
    <HighlightSortOptions
      sortType={sortType}
      sortDay={sortDay}
      onSortTypeChange={onSortTypeChange}
      onSortDayChange={onSortDayChange}
      expanded={false}
    />
  );

  return (
    <Drawer
      direction="down"
      openedContent={openedContent}
      closedContent={closedContent}
    />
  );
};
