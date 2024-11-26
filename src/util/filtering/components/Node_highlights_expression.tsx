import { Button } from "components/atoms/Button";
import { font_size_x_small, grey600 } from "components/styles";
import React, { useRef, useState } from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";
import { removeFilterExpression } from "./filter-tree-actions";
import { NewFilterExpressionPopover } from "./NewFilterExpressionPopover";

export const Node_highlights_expression: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
  performAction,
  transformProgram,
  relationChooserProps,
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
        performAction(removeFilterExpression, { expression: endowedNode });
      }}
      style={{ fontSize: font_size_x_small, color: grey600 }}
    >
      - filter
    </Button>
  );

  const [showAddFilterPopover, setShowAddFilterPopover] = useState(false);
  const addFilterPopoverRef = useRef<HTMLButtonElement>();

  const addAnd = (
    <>
      <NewFilterExpressionPopover
        show={showAddFilterPopover}
        setShow={setShowAddFilterPopover}
        anchorEl={addFilterPopoverRef.current}
        relationChooserProps={relationChooserProps}
        onCreateDatesFilter={() => {
          transformProgram((program) =>
            program.updateNodeText(
              endowedNode,
              `(${endowedNode.rawNode.text} and from "beginning" to "today")`
            )
          );
        }}
        onRelationChoose={(relation) => {}}
      />
      <Button
        variant="link"
        ref={addFilterPopoverRef}
        onClick={() => {
          setShowAddFilterPopover(true);
        }}
        style={{ fontSize: font_size_x_small, color: grey600 }}
      >
        + and
      </Button>
    </>
  );

  const editModeMarkup = (
    <ChildrenContainer
      highlight={highlightChildren}
      node={endowedNode}
      layout="inline"
    >
      {childComponents} {addAnd} {removeFilter}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = <>{childComponents}</>;

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
