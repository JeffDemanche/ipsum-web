import { Button } from "components/atoms/Button";
import { MenuItem } from "components/atoms/MenuItem";
import { Popover } from "components/atoms/Popover";
import { font_size_x_small, grey600 } from "components/styles";
import React, { useState } from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_filter_expression_highlights: NodeComponent = ({
  editMode,
  endowedNode,
  transformProgram,
  childComponents,
}: NodeComponentProps) => {
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
          setAddFilterPopoverTarget(null);
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
          setAddFilterPopoverTarget(null);
        }}
      >
        by relation
      </MenuItem>
    </Popover>
  );

  const showAddFilter = !endowedNode.children.some(
    (child) => child.type === "highlights_expression"
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

  const showAddSort = !endowedNode.children.some(
    (child) => child.type === "sort_expression_highlights"
  );

  const addSort = showAddSort ? (
    <Button
      variant="link"
      onClick={() => {
        transformProgram((program) =>
          program.updateNodeText(
            endowedNode,
            `${endowedNode.rawNode.text} sorted by importance as of "today"`
          )
        );
      }}
      style={{ fontSize: font_size_x_small, color: grey600 }}
    >
      + sort
    </Button>
  ) : null;

  const editModeMarkup = (
    <ChildrenContainer node={endowedNode} layout="block">
      {childComponents}
      {addFilter}
      {addFilterPopover}
      {addSort}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = <>{childComponents}</>;

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
