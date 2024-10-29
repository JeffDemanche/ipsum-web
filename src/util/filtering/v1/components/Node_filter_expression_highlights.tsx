import { Button } from "components/atoms/Button";
import { MenuItem } from "components/atoms/MenuItem";
import { Popover } from "components/atoms/Popover";
import { font_size_x_small, grey600 } from "components/styles";
import React, { useState } from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_filter_expression_highlights: NodeComponent = ({
  editMode,
  endowedNode,
  transformProgram,
  childComponents,
}: NodeComponentProps) => {
  const showAddFilter = !endowedNode.children.some(
    (child) => child.type === "highlights_expression"
  );

  const showRemoveFilter = endowedNode.children.some(
    (child) => child.type === "highlights_expression"
  );

  const [addFilterPopoverTarget, setAddFilterPopoverTarget] =
    useState<HTMLButtonElement>(null);

  const addFilterPopover = (
    <Popover
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={() => {
        setAddFilterPopoverTarget(null);
      }}
      anchorEl={addFilterPopoverTarget}
    >
      <MenuItem
        onClick={() => {
          transformProgram((program) =>
            program.updateNodeText(
              endowedNode,
              `${endowedNode.rawNode.text} from "beginning" to "today"`
            )
          );
        }}
      >
        by dates
      </MenuItem>
      <MenuItem
        onClick={() => {
          transformProgram((program) =>
            program.updateNodeText(
              endowedNode,
              `${endowedNode.rawNode.text} relates to "1"`
            )
          );
        }}
      >
        by relation
      </MenuItem>
    </Popover>
  );

  const addFilter = showAddFilter ? (
    <Button
      variant="link"
      onClick={(e) => {
        setAddFilterPopoverTarget(e.currentTarget);
      }}
      style={{ fontSize: font_size_x_small, color: grey600 }}
    >
      + filter
    </Button>
  ) : null;

  const removeFilter = showRemoveFilter ? (
    <Button
      variant="link"
      onClick={() => {
        transformProgram((program) => program.updateNodeText(endowedNode, ""));
      }}
      style={{ fontSize: font_size_x_small, color: grey600 }}
    >
      - filter
    </Button>
  ) : null;

  const editModeMarkup = (
    <>
      {childComponents}
      {addFilter}
      {addFilterPopover}
      {removeFilter}
    </>
  );

  const nonEditModeMarkup = <>{childComponents}</>;

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
