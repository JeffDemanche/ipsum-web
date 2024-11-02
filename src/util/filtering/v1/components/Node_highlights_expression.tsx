import { Button } from "components/atoms/Button";
import { font_size_x_small, grey600 } from "components/styles";
import React, { useState } from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_highlights_expression: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
  transformProgram,
}: NodeComponentProps) => {
  const [highlightChildren, setHighlightChildren] = useState(false);

  const removeFilter = (
    <Button
      variant="link"
      onMouseEnter={() => {
        setHighlightChildren(true);
      }}
      onMouseLeave={() => {
        setHighlightChildren(false);
      }}
      onClick={() => {
        transformProgram((program) => program.updateNodeText(endowedNode, ""));
      }}
      style={{ fontSize: font_size_x_small, color: grey600 }}
    >
      - filter
    </Button>
  );

  const editModeMarkup = (
    <ChildrenContainer
      highlight={highlightChildren}
      node={endowedNode}
      layout="inline"
    >
      {childComponents}
      {removeFilter}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = <>{childComponents}</>;

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
