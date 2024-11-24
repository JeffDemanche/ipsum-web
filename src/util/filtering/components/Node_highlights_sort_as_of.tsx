import { Type } from "components/atoms/Type";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_highlights_sort_as_of: NodeComponent = ({
  childComponents,
}: NodeComponentProps) => {
  return (
    <>
      <Type display="inline" weight="light" size="small">
        {" "}
        as of{" "}
      </Type>
      {childComponents}
    </>
  );
};
