import { Button } from "components/atoms/Button";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_day: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
}: NodeComponentProps) => {
  return editMode ? (
    <Button>{endowedNode.rawNode.text}</Button>
  ) : (
    <>{endowedNode.rawNode.text}</>
  );
};
