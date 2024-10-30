import { Type } from "components/atoms/Type";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_highlights_criterion_relation: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
}: NodeComponentProps) => {
  return (
    <ChildrenContainer node={endowedNode} layout="inline">
      <Type display="inline" weight="light" size="small">
        which{" "}
      </Type>
      {childComponents}
    </ChildrenContainer>
  );
};
