import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_highlights_sort_as_of: NodeComponent = ({
  childComponents,
}: NodeComponentProps) => {
  return <> as of {childComponents}</>;
};
