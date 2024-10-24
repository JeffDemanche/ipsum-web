import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_filter_expression_highlights: NodeComponent = ({
  editMode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  const editModeMarkup = <>{childComponents}</>;

  const nonEditModeMarkup = <>{childComponents}</>;

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
