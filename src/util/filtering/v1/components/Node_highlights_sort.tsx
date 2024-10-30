import { Type } from "components/atoms/Type";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_highlights_sort: NodeComponent = ({
  editMode,
  childComponents,
  endowedNode,
}: NodeComponentProps) => {
  const editModeMarkup = (
    <ChildrenContainer node={endowedNode} layout="inline">
      <Type display="inline" weight="light" size="small">
        sorted by{" "}
      </Type>
      {childComponents}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = (
    <>
      <Type display="inline" weight="light" size="small">
        sorted by{" "}
      </Type>
      {childComponents}
    </>
  );

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
