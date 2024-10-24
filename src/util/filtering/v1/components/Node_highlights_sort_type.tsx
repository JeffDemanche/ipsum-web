import { MenuItem } from "components/atoms/MenuItem";
import { Select } from "components/atoms/Select";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_highlights_sort_type: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  const sortTypeOptions = ["recent", "importance"];

  const editModeMarkup = (
    <>
      <Select variant="text" value={endowedNode.rawNode.text}>
        {sortTypeOptions.map((type) => (
          <MenuItem key={type} value={type} onClick={() => {}}>
            {type}
          </MenuItem>
        ))}
      </Select>
      {childComponents}
    </>
  );

  const nonEditModeMarkup = <>{childComponents}</>;

  return <>{editMode ? editModeMarkup : nonEditModeMarkup}</>;
};
