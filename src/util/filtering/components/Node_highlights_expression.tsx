import { Button } from "components/atoms/Button";
import { font_size_x_small, grey600 } from "components/styles";
import React, { useRef, useState } from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";
import {
  addFilterExpression,
  removeFilterExpression,
} from "./filter-tree-actions";
import { NewFilterExpressionPopover } from "./NewFilterExpressionPopover";

export const Node_highlights_expression: NodeComponent = ({
  editMode,
  endowedNode,
  childComponents,
  performAction,
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

  const firstChild = endowedNode.children[0];

  const addAnd = (
    <>
      <NewFilterExpressionPopover
        show={showAddFilterPopover}
        setShow={setShowAddFilterPopover}
        anchorEl={addFilterPopoverRef.current}
        relationChooserProps={relationChooserProps}
        onCreateDatesFilter={() => {
          performAction(addFilterExpression, {
            expression: {
              type: "dates",
              defaultDayFrom: "beginning",
              defaultDayTo: "today",
            },
            logicType: "and",
            parentNode: firstChild,
          });
        }}
        onRelationChoose={(relation) => {
          performAction(addFilterExpression, {
            expression: {
              type: "relation",
              defaultPredicate: relation.predicate,
              defaultObject: relation.objectId,
            },
            logicType: "and",
            parentNode: firstChild,
          });
        }}
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
