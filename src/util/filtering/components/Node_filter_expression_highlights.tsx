import { Button } from "components/atoms/Button";
import { font_size_x_small, grey600 } from "components/styles";
import React, { useRef, useState } from "react";

import { NodeComponent, NodeComponentProps } from "../types";
import { ChildrenContainer } from "./ChildrenContainer";
import {
  addHighlightsSort,
  addRootLevelFilterExpression,
} from "./filter-tree-actions";
import { NewFilterExpressionPopover } from "./NewFilterExpressionPopover";

export const Node_filter_expression_highlights: NodeComponent = ({
  editMode,
  endowedNode,
  performAction,
  childComponents,
  relationChooserProps,
}: NodeComponentProps) => {
  const [showAddFilterPopover, setShowAddFilterPopover] = useState(false);
  const addFilterPopoverRef = useRef<HTMLButtonElement>();

  const addFilterPopover = (
    <NewFilterExpressionPopover
      show={showAddFilterPopover}
      setShow={setShowAddFilterPopover}
      anchorEl={addFilterPopoverRef.current}
      relationChooserProps={relationChooserProps}
      onCreateDatesFilter={() => {
        performAction(addRootLevelFilterExpression, {
          expression: {
            type: "dates",
            defaultDayFrom: "beginning",
            defaultDayTo: "today",
          },
        });
        setShowAddFilterPopover(false);
      }}
      onRelationChoose={(relation) => {
        performAction(addRootLevelFilterExpression, {
          expression: {
            type: "relation",
            defaultPredicate: relation.predicate,
            defaultObject: relation.objectId,
          },
        });
        setShowAddFilterPopover(false);
      }}
    />
  );

  const showAddFilter = !endowedNode.children.some(
    (child) => child.type === "highlights_expression"
  );

  const addFilter = showAddFilter ? (
    <Button
      variant="link"
      ref={addFilterPopoverRef}
      style={{ fontSize: font_size_x_small, color: grey600 }}
      onClick={() => {
        setShowAddFilterPopover(true);
      }}
    >
      + filter
    </Button>
  ) : null;

  const showAddSort = !endowedNode.children.some(
    (child) => child.type === "sort_expression_highlights"
  );

  const addSort = showAddSort ? (
    <Button
      variant="link"
      onClick={() => {
        performAction(addHighlightsSort, { defaultSortType: "review status" });
      }}
      style={{ fontSize: font_size_x_small, color: grey600 }}
    >
      + sort
    </Button>
  ) : null;

  const editModeMarkup = (
    <ChildrenContainer node={endowedNode} layout="block" indentChildren>
      {childComponents}
      {addFilter}
      {addFilterPopover} {addSort}
    </ChildrenContainer>
  );

  const nonEditModeMarkup = <>{childComponents}</>;

  return editMode ? editModeMarkup : nonEditModeMarkup;
};
