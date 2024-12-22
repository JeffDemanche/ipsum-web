import { MenuItem } from "components/atoms/MenuItem";
import { Select } from "components/atoms/Select";
import React from "react";

import type { NodeComponent, NodeComponentProps, SortType } from "../types";
import { changeSortType } from "./filter-tree-actions";

export const Node_highlights_sort_type: NodeComponent = ({
  editMode,
  endowedNode,
  performAction,
  childComponents,
}: NodeComponentProps) => {
  const sortTypeOptions: SortType[] = [
    "review status",
    "recent first",
    "oldest first",
    "importance",
  ];

  const onSortTypeChange = (newType: SortType) => {
    performAction(changeSortType, {
      sortType: newType,
      sortTypeNode: endowedNode,
    });
  };

  const editModeMarkup = (
    <>
      <Select variant="text" value={endowedNode.rawNode.text}>
        {sortTypeOptions.map((type) => (
          <MenuItem
            key={type}
            value={type}
            onClick={() => {
              onSortTypeChange(type);
            }}
          >
            {type}
          </MenuItem>
        ))}
      </Select>{" "}
      {childComponents}
    </>
  );

  const nonEditModeMarkup = (
    <>
      {endowedNode.rawNode.text}
      {childComponents}
    </>
  );

  return <>{editMode ? editModeMarkup : nonEditModeMarkup}</>;
};
