import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_filter_expression_highlights: NodeComponent = ({
  editMode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  return <span>highlights {childComponents}</span>;
};
