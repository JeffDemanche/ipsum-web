import { MenuItem } from "components/atoms/MenuItem";
import { Select } from "components/atoms/Select";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_predicate: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
}: NodeComponentProps) => {
  const predicateOptions = ["is", "relates to"];

  const value = endowedNode.rawNode.text;

  const editModeMarkup = (
    <ChildrenContainer node={endowedNode} layout="inline">
      <Select style={{ display: "inline" }} value={value} variant="text">
        {predicateOptions.map((predicate) => (
          <MenuItem key={predicate} value={predicate} onClick={() => {}}>
            {predicate}
          </MenuItem>
        ))}
      </Select>{" "}
      {childComponents}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = <span>{childComponents}</span>;

  return <>{editMode ? editModeMarkup : nonEditModeMarkup}</>;
};
