import { MenuItem } from "components/atoms/MenuItem";
import { Select } from "components/atoms/Select";
import { Type } from "components/atoms/Type";
import React from "react";

import { FilterType, NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";
import { changeFilterType } from "./filter-tree-actions";

export const Node_filter: NodeComponent = ({
  editMode,
  endowedNode,
  performAction,
  childComponents,
}: NodeComponentProps) => {
  const filterType = endowedNode.rawNode.text.startsWith("highlights")
    ? "filter_expression_highlights"
    : "filter_expression_arcs";

  const filterTypeOptions: FilterType[] = ["highlights", "arcs"];

  const value: FilterType =
    filterType === "filter_expression_highlights" ? "highlights" : "arcs";

  const onFilterTypeChange = (newType: FilterType) => {
    performAction(changeFilterType, {
      filterNode: endowedNode,
      filterType: newType,
    });
  };

  const editModeMarkup = (
    <ChildrenContainer node={endowedNode} layout="inline">
      <Select value={value} variant="text">
        {filterTypeOptions.map((type) => (
          <MenuItem
            key={type}
            value={type}
            onClick={() => {
              onFilterTypeChange(type);
            }}
          >
            {type}
          </MenuItem>
        ))}
      </Select>{" "}
      {childComponents}
    </ChildrenContainer>
  );

  if (
    filterType !== "filter_expression_highlights" &&
    filterType !== "filter_expression_arcs"
  ) {
    return <Type>Invalid filter type</Type>;
  }

  const nonEditModeMarkup = (
    <Type weight="light" size="small">
      {filterType === "filter_expression_highlights" ? "highlights" : "arcs"}{" "}
      {childComponents}
    </Type>
  );

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
