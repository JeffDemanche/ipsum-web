import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_ifl: NodeComponent = ({
  editMode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  return <>{childComponents}</>;
};
