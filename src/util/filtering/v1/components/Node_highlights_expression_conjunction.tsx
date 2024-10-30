import { Type } from "components/atoms/Type";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_highlights_expression_conjunction: NodeComponent = ({
  editMode,
  childComponents,
  endowedNode,
}: NodeComponentProps) => {
  const andSeparatedChildComponents = childComponents.reduce(
    (acc, child, index) => {
      if (index === 0) {
        return [child];
      }
      return [
        ...acc,
        <ChildrenContainer
          node={endowedNode}
          layout="inline"
          key={endowedNode.children[index].coordinates.join("")}
        >
          {" "}
          <Type display="inline" weight="light" size="small" key={index}>
            {" "}
            and{" "}
          </Type>
          {child}
        </ChildrenContainer>,
      ];
    },
    []
  );

  const editModeMarkup = (
    <ChildrenContainer node={endowedNode} layout="block">
      {andSeparatedChildComponents}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = <>{andSeparatedChildComponents}</>;

  return <>{editMode ? editModeMarkup : nonEditModeMarkup}</>;
};
