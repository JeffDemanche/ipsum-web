import { Type } from "components/atoms/Type";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";

export const Node_highlights_sort: NodeComponent = ({
  editMode,
  childComponents,
  onAddChild,
  onDeleteSelf,
  onRemoveChild,
}: NodeComponentProps) => {
  const editModeMarkup = (
    <>
      <Type display="inline" weight="light" size="small">
        sorted by{" "}
      </Type>
      {childComponents}
    </>
  );

  const nonEditModeMarkup = (
    <>
      <Type display="inline" weight="light" size="small">
        sorted by{" "}
      </Type>
      {childComponents}
    </>
  );

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
