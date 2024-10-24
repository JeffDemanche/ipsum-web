import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_highlights_expression: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  return <>{childComponents}</>;
};
