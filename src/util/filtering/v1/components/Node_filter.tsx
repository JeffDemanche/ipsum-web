import { MenuItem } from "components/atoms/MenuItem";
import { Select } from "components/atoms/Select";
import { Type } from "components/atoms/Type";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_filter: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  const filterType = endowedNode.children[0].type;

  const filterTypeOptions = ["highlights", "arcs"];

  if (
    filterType !== "filter_expression_highlights" &&
    filterType !== "filter_expression_arcs"
  ) {
    return <Type>Invalid filter type</Type>;
  }

  const value =
    filterType === "filter_expression_highlights" ? "highlights" : "arcs";

  const editModeMarkup = (
    <>
      <Select value={value} variant="text">
        {filterTypeOptions.map((type) => (
          <MenuItem key={type} value={type} onClick={() => {}}>
            {type}
          </MenuItem>
        ))}
      </Select>{" "}
      {childComponents}
    </>
  );

  const nonEditModeMarkup = <span>{childComponents}</span>;

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
