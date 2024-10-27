import { Type } from "components/atoms/Type";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_highlights_criterion_relation: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  return (
    <>
      <Type display="inline" weight="light" size="small">
        which{" "}
      </Type>
      {childComponents}
    </>
  );
};
