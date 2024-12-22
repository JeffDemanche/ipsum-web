import { Type } from "components/atoms/Type";
import React from "react";

import type { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_highlights_sort: NodeComponent = ({
  editMode,
  childComponents,
  endowedNode,
}: NodeComponentProps) => {
  const editModeMarkup = (
    <ChildrenContainer node={endowedNode} layout="inline">
      <Type component="span" display="inline" weight="light" size="small">
        sorted by{" "}
      </Type>
      {childComponents}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = (
    <Type component="span" display="inline" weight="light" size="small">
      sorted by {childComponents}
    </Type>
  );

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
