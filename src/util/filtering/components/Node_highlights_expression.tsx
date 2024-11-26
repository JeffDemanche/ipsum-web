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

  const [showAddAndFilterPopover, setShowAddAndFilterPopover] = useState(false);
  const addAndFilterPopoverRef = useRef<HTMLButtonElement>();

  const [showAddOrFilterPopover, setShowAddOrFilterPopover] = useState(false);
  const addOrFilterPopoverRef = useRef<HTMLButtonElement>();

  const firstChild = endowedNode.children[0];

  const addAnd = (
    <>
      <NewFilterExpressionPopover
        show={showAddAndFilterPopover}
        setShow={setShowAddAndFilterPopover}
        anchorEl={addAndFilterPopoverRef.current}
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
        ref={addAndFilterPopoverRef}
        onClick={() => {
          setShowAddAndFilterPopover(true);
        }}
        style={{ fontSize: font_size_x_small, color: grey600 }}
      >
        + and
      </Button>
    </>
  );

  const addOr = (
    <>
      <NewFilterExpressionPopover
        show={showAddOrFilterPopover}
        setShow={setShowAddOrFilterPopover}
        anchorEl={addOrFilterPopoverRef.current}
        relationChooserProps={relationChooserProps}
        onCreateDatesFilter={() => {
          performAction(addFilterExpression, {
            expression: {
              type: "dates",
              defaultDayFrom: "beginning",
              defaultDayTo: "today",
            },
            logicType: "or",
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
            logicType: "or",
            parentNode: firstChild,
          });
        }}
      />
      <Button
        variant="link"
        ref={addOrFilterPopoverRef}
        onClick={() => {
          setShowAddOrFilterPopover(true);
        }}
        style={{ fontSize: font_size_x_small, color: grey600 }}
      >
        + or
      </Button>
    </>
  );

  const editModeMarkup = (
    <ChildrenContainer
      highlight={highlightChildren}
      node={endowedNode}
      layout="inline"
    >
      {childComponents} {addOr} {addAnd} {removeFilter}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = <>{childComponents}</>;

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
