import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_highlights_criterion: NodeComponent = ({
  editMode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  return <>{childComponents}</>;
};
