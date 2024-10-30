import { MenuItem } from "components/atoms/MenuItem";
import { Select } from "components/atoms/Select";
import { Type } from "components/atoms/Type";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_filter: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
  transformProgram,
}: NodeComponentProps) => {
  const filterType = endowedNode.children[0].type;

  const filterTypeOptions = ["highlights", "arcs"];

  const value =
    filterType === "filter_expression_highlights" ? "highlights" : "arcs";

  const onFilterTypeChange = (newType: string) => {
    transformProgram((program) => program.updateNodeText(endowedNode, newType));
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
      {childComponents}
    </Type>
  );

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
