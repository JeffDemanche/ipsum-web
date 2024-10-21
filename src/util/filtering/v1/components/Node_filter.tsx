import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_filter: NodeComponent = ({
  editMode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  return <span>{childComponents}</span>;
};
