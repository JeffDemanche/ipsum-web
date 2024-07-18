import { Drawer } from "components/atoms/Drawer";
import { HighlightFilterOptions } from "components/molecules/HighlightFilterOptions";
import { HighlightSortOptions } from "components/molecules/HighlightSortOptions";
import { border_dashed } from "components/styles";
import React from "react";
import { IpsumDay } from "util/dates";
import { SortType } from "util/sort";

import styles from "./HighlightResultsOptionsDrawer.less";

interface HighlightResultsOptionsDrawerProps {
  defaultExpanded: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;

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
  onAddRelationFilter?: (predicate: string) => void;
}

export const HighlightResultsOptionsDrawer: React.FunctionComponent<
  HighlightResultsOptionsDrawerProps
> = ({
  defaultExpanded,
  onExpand,
  onCollapse,
  sortType,
  sortDay,
  onSortDayChange,
  onSortTypeChange,
  relations,
  onAddRelationFilter,
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
      <hr style={{ border: "none", borderTop: border_dashed }} />
      <HighlightFilterOptions
        expanded
        relations={relations}
        onCreateRelation={onAddRelationFilter}
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
        onCreateRelation={onAddRelationFilter}
      />
    </div>
  );

  return (
    <Drawer
      direction="down"
      defaultOpen={defaultExpanded}
      onOpen={onExpand}
      onClose={onCollapse}
      openedContent={openedContent}
      closedContent={closedContent}
    />
  );
};
