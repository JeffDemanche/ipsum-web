import { MenuItem } from "components/atoms/MenuItem";
import { Select } from "components/atoms/Select";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_highlights_sort_type: NodeComponent = ({
  editMode,
  endowedNode,
  transformProgram,
  childComponents,
}: NodeComponentProps) => {
  const sortTypeOptions = ["review status", "recent", "importance"];

  const onSortTypeChange = (newType: string) => {
    transformProgram((program) => program.updateNodeText(endowedNode, newType));
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
