import React from "react";

import type { NodeComponent, NodeComponentProps } from "../types";

export const Node_ifl: NodeComponent = ({
  childComponents,
}: NodeComponentProps) => {
  return <>{childComponents}</>;
};
