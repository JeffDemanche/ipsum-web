import { Button } from "components/atoms/Button";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_relation_object: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  return (
    <>
      <Button>{endowedNode.rawNode.text}</Button>{" "}
    </>
  );
};
