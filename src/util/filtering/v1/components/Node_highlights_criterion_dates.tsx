import { Type } from "components/atoms/Type";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_highlights_criterion_dates: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  return (
    <>
      <Type display="inline" size="small">
        from
      </Type>
      {childComponents[0]}
      <Type display="inline" size="small">
        to
      </Type>
      {childComponents[1]}
    </>
  );
};
