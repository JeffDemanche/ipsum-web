import { Type } from "components/atoms/Type";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_highlights_expression_conjunction: NodeComponent = ({
  editMode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  const andSeparatedChildComponents = childComponents.reduce(
    (acc, child, index) => {
      if (index === 0) {
        return [child];
      }
      return [
        ...acc,
        <Type display="inline" size="small" key={index}>
          {" "}
          and{" "}
        </Type>,
        child,
      ];
    },
    []
  );

  const editModeMarkup = <>{andSeparatedChildComponents}</>;

  const nonEditModeMarkup = <>{andSeparatedChildComponents}</>;

  return <>{editMode ? editModeMarkup : nonEditModeMarkup}</>;
};
