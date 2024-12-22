import React from "react";

import type { NodeComponent, NodeComponentProps } from "../types";

export const Node_highlights_criterion: NodeComponent = ({
  editMode,
  childComponents,
}: NodeComponentProps) => {
  return <>{childComponents}</>;
};
