import { Drawer } from "components/atoms/Drawer";
import React from "react";
import { IpsumDay } from "util/dates";
import { SortType } from "util/sort";

import { HighlightFilterOptions } from "../HighlightFilterOptions";
import { HighlightSortOptions } from "../HighlightSortOptions";
import styles from "./HighlightResultsOptionsDrawer.less";

interface HighlightResultsOptionsDrawerProps {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;

  sortType: SortType;
  sortDay: IpsumDay;
  onSortTypeChange: (sortType: string) => void;
  onSortDayChange: (sortDay: IpsumDay) => void;

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
  relations,
  onCreateRelation,
}) => {
  const openedContent = (
    <div className={styles["opened-container"]}>
      <HighlightSortOptions
        sortType={sortType}
        sortDay={sortDay}
        onSortTypeChange={onSortTypeChange}
        onSortDayChange={onSortDayChange}
        expanded
      />
      <HighlightFilterOptions
        expanded
        relations={relations}
        onCreateRelation={onCreateRelation}
      />
    </div>
  );

  const closedContent = (
    <div className={styles["closed-container"]}>
      <HighlightSortOptions
        sortType={sortType}
        sortDay={sortDay}
        onSortTypeChange={onSortTypeChange}
        onSortDayChange={onSortDayChange}
        expanded={false}
      />
      <HighlightFilterOptions
        expanded={false}
        relations={relations}
        onCreateRelation={onCreateRelation}
      />
    </div>
  );

  return (
    <Drawer
      direction="down"
      openedContent={openedContent}
      closedContent={closedContent}
    />
  );
};
