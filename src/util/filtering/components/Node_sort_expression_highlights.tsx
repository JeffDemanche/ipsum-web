import { Button } from "components/atoms/Button";
import { font_size_x_small, grey600 } from "components/styles";
import React, { useState } from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";
import { removeHighlightsSort } from "./filter-tree-actions";

export const Node_sort_expression_highlights: NodeComponent = ({
  editMode,
  childComponents,
  performAction,
  endowedNode,
}: NodeComponentProps) => {
  const [highlightChildren, setHighlightChildren] = useState(false);

  const removeSort = (
    <Button
      variant="link"
      onMouseEnter={() => {
        setHighlightChildren(true);
      }}
      onMouseLeave={() => {
        setHighlightChildren(false);
      }}
      onClick={() => {
        performAction(removeHighlightsSort, {});
      }}
      style={{
        fontSize: font_size_x_small,
        color: grey600,
      }}
    >
      - sort
    </Button>
  );

  const editModeMarkup = (
    <ChildrenContainer
      highlight={highlightChildren}
      node={endowedNode}
      layout="inline"
    >
      {childComponents} {removeSort}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = <>{childComponents}</>;

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
