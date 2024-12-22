import { MenuItem } from "components/atoms/MenuItem";
import { Popover } from "components/atoms/Popover";
import { Select } from "components/atoms/Select";
import React, { useState } from "react";

import type { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_predicate: NodeComponent = ({
  editMode,
  endowedNode,
  transformProgram,
  childComponents,
}: NodeComponentProps) => {
  const predicateOptions = ["is", "relates to"];

  const value = endowedNode.rawNode.text;

  const editModeMarkup = (
    <ChildrenContainer node={endowedNode} layout="inline">
      <Select style={{ display: "inline" }} value={value} variant="text">
        {predicateOptions.map((predicate) => (
          <MenuItem
            key={predicate}
            value={predicate}
            onClick={() => {
              transformProgram((program) =>
                program.updateNodeText(endowedNode, predicate)
              );
            }}
          >
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
