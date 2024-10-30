import { Button } from "components/atoms/Button";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_relation_object: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
}: NodeComponentProps) => {
  return (
    <ChildrenContainer node={endowedNode} layout="inline">
      <Button>{endowedNode.rawNode.text}</Button>{" "}
    </ChildrenContainer>
  );
};
