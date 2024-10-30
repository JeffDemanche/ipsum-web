import { Button } from "components/atoms/Button";
import { font_size_x_small, grey600 } from "components/styles";
import React from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";

export const Node_sort_expression_highlights: NodeComponent = ({
  editMode,
  childComponents,
  transformProgram,
  endowedNode,
}: NodeComponentProps) => {
  const removeSort = (
    <Button
      variant="link"
      onClick={() => {
        transformProgram((program) =>
          program.updateNodeText(
            endowedNode.children.find(
              (child) => child.type === "sort_expression_highlights"
            ),
            ""
          )
        );
      }}
      style={{ fontSize: font_size_x_small, color: grey600 }}
    >
      - sort
    </Button>
  );

  const editModeMarkup = (
    <ChildrenContainer node={endowedNode} layout="inline">
      {childComponents}
      {removeSort}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = <>{childComponents}</>;

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
